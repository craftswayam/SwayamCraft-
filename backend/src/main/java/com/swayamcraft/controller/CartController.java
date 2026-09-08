package com.swayamcraft.controller;

import com.swayamcraft.dto.CartItemRequest;
import com.swayamcraft.model.CartItem;
import com.swayamcraft.model.User;
import com.swayamcraft.service.AuthService;
import com.swayamcraft.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<List<CartItem>> getCart() {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(cartService.getCartItems(user));
    }

    @PostMapping("/items")
    public ResponseEntity<CartItem> addToCart(@Valid @RequestBody CartItemRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(cartService.addToCart(user, request));
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<CartItem> updateCartItemQuantity(
            @PathVariable Long id,
            @RequestParam Integer quantity) {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(cartService.updateQuantity(user, id, quantity));
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        cartService.removeItem(user, id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart() {
        User user = authService.getCurrentAuthenticatedUser();
        cartService.clearCart(user);
        return ResponseEntity.noContent().build();
    }
}
