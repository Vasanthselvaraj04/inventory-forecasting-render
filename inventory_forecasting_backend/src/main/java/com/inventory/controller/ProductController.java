package com.inventory.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.inventory.entity.Product;
import com.inventory.service.ProductService;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /* ===== GET ALL PRODUCTS ===== */
    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    /* ===== ADD PRODUCT ===== */
    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        return productService.addProduct(product);
    }
}
