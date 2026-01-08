package com.inventory.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.inventory.entity.Product;
import com.inventory.repository.ProductRepository;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*") // allow frontend + postman
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // ===================== GET : ALL PRODUCTS =====================
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // ===================== GET : PRODUCT BY ID =====================
    @GetMapping("/{productId}")
    public Product getProductById(@PathVariable int productId) {
        return productRepository.findById(productId).orElse(null);
    }

    // ===================== POST : ADD PRODUCT =====================
    @PostMapping
    public ResponseEntity<Product> addProduct(@RequestBody Product product) {

        // safety checks
        if (product.getProductName() == null || product.getProductName().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        if (product.getUnitPrice() < 0) {
            return ResponseEntity.badRequest().build();
        }

        Product savedProduct = productRepository.save(product);
        return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
    }
}
