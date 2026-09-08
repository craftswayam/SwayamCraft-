package com.swayamcraft.service;

import com.swayamcraft.dto.DashboardReportDto;
import com.swayamcraft.model.Order;
import com.swayamcraft.model.OrderStatus;
import com.swayamcraft.model.Product;
import com.swayamcraft.repository.CategoryRepository;
import com.swayamcraft.repository.OrderRepository;
import com.swayamcraft.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public DashboardReportDto getDashboardMetrics() {
        BigDecimal totalRevenue = orderRepository.calculateTotalRevenue();
        long totalOrders = orderRepository.count();
        long pendingOrders = orderRepository.countByStatus(OrderStatus.PENDING);
        long craftingOrders = orderRepository.countByStatus(OrderStatus.CRAFTING);
        long deliveredOrders = orderRepository.countByStatus(OrderStatus.DELIVERED);
        long totalProducts = productRepository.countByIsActiveTrue();

        List<Product> lowStockProducts = productRepository.findByStockQuantityLessThanEqual(5);
        List<Order> recentOrders = orderRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .limit(10)
                .toList();

        Map<String, Long> categoryCounts = new HashMap<>();
        categoryRepository.findAll().forEach(cat -> {
            long count = productRepository.findByCategorySlugAndIsActiveTrue(cat.getSlug()).size();
            categoryCounts.put(cat.getName(), count);
        });

        Map<String, Long> statusCounts = new HashMap<>();
        for (OrderStatus status : OrderStatus.values()) {
            statusCounts.put(status.name(), orderRepository.countByStatus(status));
        }

        return DashboardReportDto.builder()
                .totalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO)
                .totalOrders(totalOrders)
                .pendingOrders(pendingOrders)
                .craftingOrders(craftingOrders)
                .deliveredOrders(deliveredOrders)
                .totalProducts(totalProducts)
                .lowStockCount(lowStockProducts.size())
                .lowStockProducts(lowStockProducts)
                .recentOrders(recentOrders)
                .categoryProductCounts(categoryCounts)
                .orderStatusCounts(statusCounts)
                .build();
    }
}
