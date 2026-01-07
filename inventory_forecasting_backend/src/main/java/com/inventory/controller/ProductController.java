package com.inventory.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.inventory.entity.Product;
import com.inventory.repository.ProductRepository;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    /* ===================== GET : ALL PRODUCTS ===================== */
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    /* ===================== GET : PRODUCT BY ID ===================== */
    @GetMapping("/{productId}")
    public Product getProductById(@PathVariable int productId) {
        return productRepository.findById(productId)
                .orElse(null);
    }
}
