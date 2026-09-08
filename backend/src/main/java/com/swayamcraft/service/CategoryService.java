package com.swayamcraft.service;

import com.swayamcraft.model.Category;
import com.swayamcraft.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<Category> getActiveCategories() {
        return categoryRepository.findByIsActiveTrueOrderByDisplayOrderAsc();
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getBySlug(String slug) {
        return categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Category not found with slug: " + slug));
    }

    @Transactional
    public Category createCategory(Category category) {
        if (category.getSlug() == null || category.getSlug().isBlank()) {
            category.setSlug(category.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-"));
        }
        return categoryRepository.save(category);
    }
}
