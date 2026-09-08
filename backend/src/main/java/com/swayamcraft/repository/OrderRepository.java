package com.swayamcraft.repository;

import com.swayamcraft.model.Order;
import com.swayamcraft.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findAllByOrderByCreatedAtDesc();
    List<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.paymentStatus = com.swayamcraft.model.PaymentStatus.PAID")
    BigDecimal calculateTotalRevenue();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status")
    long countByStatus(OrderStatus status);
}
