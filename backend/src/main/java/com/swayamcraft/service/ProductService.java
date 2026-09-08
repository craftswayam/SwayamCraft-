package com.swayamcraft.service;

import com.swayamcraft.dto.PriceUpdateRequest;
import com.swayamcraft.dto.ProductRequest;
import com.swayamcraft.dto.StockUpdateRequest;
import com.swayamcraft.model.Category;
import com.swayamcraft.model.Product;
import com.swayamcraft.repository.CategoryRepository;
import com.swayamcraft.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public List<Product> getAllActiveProducts() {
        return productRepository.findByIsActiveTrueOrderByCreatedAtDesc();
    }

    public List<Product> getAllProductsForAdmin() {
        return productRepository.findAll();
    }

    public List<Product> getProductsByCategory(String categorySlug) {
        return productRepository.findByCategorySlugAndIsActiveTrue(categorySlug);
    }

    public List<Product> searchProducts(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllActiveProducts();
        }
        return productRepository.searchProducts(query.trim());
    }

    public List<Product> getFeaturedProducts() {
        return productRepository.findByIsFeaturedTrueAndIsActiveTrue();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    @Transactional
    public Product createProduct(ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));

        Product product = Product.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(category)
                .price(request.getPrice())
                .discountPrice(request.getDiscountPrice())
                .stockQuantity(request.getStockQuantity())
                .images(request.getImages() != null ? new ArrayList<>(request.getImages()) : new ArrayList<>())
                .fragranceNotes(request.getFragranceNotes())
                .resinDetails(request.getResinDetails())
                .dimensions(request.getDimensions())
                .burnTime(request.getBurnTime())
                .isCustomizable(request.getIsCustomizable() != null ? request.getIsCustomizable() : true)
                .tags(request.getTags())
                .isFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : false)
                .isActive(true)
                .build();

        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(Long id, ProductRequest request) {
        Product product = getProductById(id);

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));
            product.setCategory(category);
        }

        product.setTitle(request.getTitle());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setDiscountPrice(request.getDiscountPrice());
        product.setStockQuantity(request.getStockQuantity());
        if (request.getImages() != null) {
            product.setImages(new ArrayList<>(request.getImages()));
        }
        product.setFragranceNotes(request.getFragranceNotes());
        product.setResinDetails(request.getResinDetails());
        product.setDimensions(request.getDimensions());
        product.setBurnTime(request.getBurnTime());
        if (request.getIsCustomizable() != null) {
            product.setIsCustomizable(request.getIsCustomizable());
        }
        product.setTags(request.getTags());
        if (request.getIsFeatured() != null) {
            product.setIsFeatured(request.getIsFeatured());
        }

        return productRepository.save(product);
    }

    @Transactional
    public Product updatePrice(Long id, PriceUpdateRequest request) {
        Product product = getProductById(id);
        product.setPrice(request.getPrice());
        product.setDiscountPrice(request.getDiscountPrice());
        return productRepository.save(product);
    }

    @Transactional
    public Product updateStock(Long id, StockUpdateRequest request) {
        Product product = getProductById(id);
        product.setStockQuantity(request.getStockQuantity());
        return productRepository.save(product);
    }

    @Transactional
    public Product addImageToProduct(Long id, String imageUrl) {
        Product product = getProductById(id);
        product.getImages().add(imageUrl);
        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        // Soft delete
        product.setIsActive(false);
        productRepository.save(product);
    }
}
