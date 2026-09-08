package com.swayamcraft.service;

import com.swayamcraft.dto.CartItemRequest;
import com.swayamcraft.model.CartItem;
import com.swayamcraft.model.Product;
import com.swayamcraft.model.User;
import com.swayamcraft.repository.CartItemRepository;
import com.swayamcraft.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public List<CartItem> getCartItems(User user) {
        return cartItemRepository.findByUserId(user.getId());
    }

    @Transactional
    public CartItem addToCart(User user, CartItemRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found: " + request.getProductId()));

        Optional<CartItem> existingItemOpt = cartItemRepository.findByUserIdAndProductId(user.getId(), product.getId());

        if (existingItemOpt.isPresent()) {
            CartItem item = existingItemOpt.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            if (request.getCustomGiftMessage() != null) {
                item.setCustomGiftMessage(request.getCustomGiftMessage());
            }
            return cartItemRepository.save(item);
        } else {
            CartItem newItem = CartItem.builder()
                    .user(user)
                    .product(product)
                    .quantity(request.getQuantity())
                    .customGiftMessage(request.getCustomGiftMessage())
                    .build();
            return cartItemRepository.save(newItem);
        }
    }

    @Transactional
    public CartItem updateQuantity(User user, Long cartItemId, Integer quantity) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found: " + cartItemId));

        if (!item.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized cart access");
        }

        if (quantity <= 0) {
            cartItemRepository.delete(item);
            return null;
        }

        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }

    @Transactional
    public void removeItem(User user, Long cartItemId) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found: " + cartItemId));

        if (!item.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized cart access");
        }

        cartItemRepository.delete(item);
    }

    @Transactional
    public void clearCart(User user) {
        cartItemRepository.deleteByUserId(user.getId());
    }
}
