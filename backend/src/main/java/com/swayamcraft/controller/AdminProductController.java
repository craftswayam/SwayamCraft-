package com.swayamcraft.controller;

import com.swayamcraft.dto.PriceUpdateRequest;
import com.swayamcraft.dto.ProductRequest;
import com.swayamcraft.dto.StockUpdateRequest;
import com.swayamcraft.model.Category;
import com.swayamcraft.model.Product;
import com.swayamcraft.service.CategoryService;
import com.swayamcraft.service.FileStorageService;
import com.swayamcraft.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SELLER')")
@RequiredArgsConstructor
public class AdminProductController {

    private final ProductService productService;
    private final CategoryService categoryService;
    private final FileStorageService fileStorageService;

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProductsForAdmin());
    }

    @PostMapping("/products")
    public ResponseEntity<Product> createProduct(@Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.createProduct(request));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @PatchMapping("/products/{id}/price")
    public ResponseEntity<Product> updatePrice(
            @PathVariable Long id,
            @Valid @RequestBody PriceUpdateRequest request) {
        return ResponseEntity.ok(productService.updatePrice(id, request));
    }

    @PatchMapping("/products/{id}/stock")
    public ResponseEntity<Product> updateStock(
            @PathVariable Long id,
            @Valid @RequestBody StockUpdateRequest request) {
        return ResponseEntity.ok(productService.updateStock(id, request));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/products/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadProductImage(@RequestParam("file") MultipartFile file) {
        String fileUrl = fileStorageService.storeFile(file);
        return ResponseEntity.ok(Collections.singletonMap("imageUrl", fileUrl));
    }

    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        return ResponseEntity.ok(categoryService.createCategory(category));
    }
}
