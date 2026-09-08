package com.swayamcraft.repository;

import com.swayamcraft.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByIsActiveTrueOrderByCreatedAtDesc();

    List<Product> findByCategorySlugAndIsActiveTrue(String slug);

    List<Product> findByIsFeaturedTrueAndIsActiveTrue();

    @Query("SELECT p FROM Product p WHERE p.isActive = true AND " +
           "(LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.tags) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Product> searchProducts(@Param("query") String query);

    List<Product> findByStockQuantityLessThanEqual(Integer threshold);

    long countByIsActiveTrue();
}
