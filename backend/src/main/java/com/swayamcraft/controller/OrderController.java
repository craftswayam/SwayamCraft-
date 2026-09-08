package com.swayamcraft.controller;

import com.swayamcraft.dto.CheckoutRequest;
import com.swayamcraft.model.Order;
import com.swayamcraft.model.User;
import com.swayamcraft.service.AuthService;
import com.swayamcraft.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final AuthService authService;

    @PostMapping("/checkout")
    public ResponseEntity<Order> checkout(@Valid @RequestBody CheckoutRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(orderService.checkout(user, request));
    }

    @GetMapping
    public ResponseEntity<List<Order>> getCustomerOrders() {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(orderService.getUserOrders(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(orderService.getOrderById(user, id));
    }

    @GetMapping("/track/{orderNumber}")
    public ResponseEntity<Order> trackOrder(@PathVariable String orderNumber) {
        return ResponseEntity.ok(orderService.getByOrderNumber(orderNumber));
    }
}
