package com.swayamcraft.service;

import com.swayamcraft.dto.CartItemRequest;
import com.swayamcraft.dto.CheckoutRequest;
import com.swayamcraft.dto.OrderStatusUpdateRequest;
import com.swayamcraft.model.*;
import com.swayamcraft.repository.CartItemRepository;
import com.swayamcraft.repository.OrderRepository;
import com.swayamcraft.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;
    private final PaymentService paymentService;

    @Transactional
    public Order checkout(User user, CheckoutRequest request) {
        List<CartItem> dbCartItems = cartItemRepository.findByUserId(user.getId());
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalItemsAmount = BigDecimal.ZERO;

        // If user had items in database cart, use them; otherwise use client-submitted items
        if (!dbCartItems.isEmpty()) {
            for (CartItem cartItem : dbCartItems) {
                Product product = cartItem.getProduct();
                if (product.getStockQuantity() < cartItem.getQuantity()) {
                    throw new RuntimeException("Insufficient stock for: " + product.getTitle());
                }

                // Deduct stock
                product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
                productRepository.save(product);

                BigDecimal effectivePrice = product.getDiscountPrice() != null ? product.getDiscountPrice() : product.getPrice();
                BigDecimal itemSubtotal = effectivePrice.multiply(BigDecimal.valueOf(cartItem.getQuantity()));
                totalItemsAmount = totalItemsAmount.add(itemSubtotal);

                OrderItem orderItem = OrderItem.builder()
                        .product(product)
                        .quantity(cartItem.getQuantity())
                        .priceAtPurchase(effectivePrice)
                        .customGiftMessage(cartItem.getCustomGiftMessage())
                        .build();
                orderItems.add(orderItem);
            }
        } else if (request.getClientItems() != null && !request.getClientItems().isEmpty()) {
            for (CartItemRequest clientItem : request.getClientItems()) {
                Product product = productRepository.findById(clientItem.getProductId())
                        .orElseThrow(() -> new RuntimeException("Product not found: " + clientItem.getProductId()));

                if (product.getStockQuantity() < clientItem.getQuantity()) {
                    throw new RuntimeException("Insufficient stock for: " + product.getTitle());
                }

                // Deduct stock
                product.setStockQuantity(product.getStockQuantity() - clientItem.getQuantity());
                productRepository.save(product);

                BigDecimal effectivePrice = product.getDiscountPrice() != null ? product.getDiscountPrice() : product.getPrice();
                BigDecimal itemSubtotal = effectivePrice.multiply(BigDecimal.valueOf(clientItem.getQuantity()));
                totalItemsAmount = totalItemsAmount.add(itemSubtotal);

                OrderItem orderItem = OrderItem.builder()
                        .product(product)
                        .quantity(clientItem.getQuantity())
                        .priceAtPurchase(effectivePrice)
                        .customGiftMessage(clientItem.getCustomGiftMessage())
                        .build();
                orderItems.add(orderItem);
            }
        } else {
            throw new RuntimeException("Cannot checkout with an empty cart");
        }

        BigDecimal giftWrapFee = Boolean.TRUE.equals(request.getGiftWrap()) ? new BigDecimal("50.00") : BigDecimal.ZERO;
        BigDecimal shippingFee = totalItemsAmount.compareTo(new BigDecimal("999.00")) >= 0 ? BigDecimal.ZERO : new BigDecimal("70.00");
        BigDecimal grandTotal = totalItemsAmount.add(giftWrapFee).add(shippingFee);

        String orderNumber = "SWY-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + "-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase();

        PaymentRecord paymentRecord = paymentService.processPayment(orderNumber, grandTotal, request.getPaymentMethod());

        Order order = Order.builder()
                .orderNumber(orderNumber)
                .user(user)
                .totalAmount(grandTotal)
                .shippingFee(shippingFee)
                .giftWrapFee(giftWrapFee)
                .status(OrderStatus.PENDING)
                .paymentStatus(paymentRecord.getStatus())
                .paymentMethod(request.getPaymentMethod())
                .recipientName(request.getRecipientName())
                .shippingAddress(request.getShippingAddress())
                .city(request.getCity())
                .state(request.getState())
                .postalCode(request.getPostalCode())
                .contactPhone(request.getContactPhone())
                .giftNoteCard(request.getGiftNoteCard())
                .trackingNumber("TRK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .build();

        for (OrderItem oi : orderItems) {
            oi.setOrder(order);
        }
        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);

        // Clear user database cart
        cartItemRepository.deleteByUserId(user.getId());

        return savedOrder;
    }

    public List<Order> getUserOrders(User user) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    public Order getOrderById(User user, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        if (!order.getUser().getId().equals(user.getId()) &&
            user.getRoles().stream().noneMatch(r -> r == Role.ROLE_ADMIN || r == Role.ROLE_SELLER)) {
            throw new RuntimeException("Unauthorized access to order details");
        }

        return order;
    }

    public Order getByOrderNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderNumber));
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatusUpdateRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        order.setStatus(request.getStatus());
        if (request.getTrackingNumber() != null && !request.getTrackingNumber().isBlank()) {
            order.setTrackingNumber(request.getTrackingNumber());
        }

        if (request.getStatus() == OrderStatus.DELIVERED && order.getPaymentMethod() == PaymentMethod.COD) {
            order.setPaymentStatus(PaymentStatus.PAID);
        }

        return orderRepository.save(order);
    }
}
