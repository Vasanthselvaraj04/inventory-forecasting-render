package com.inventory.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.inventory.entity.Product;
import com.inventory.repository.ProductRepository;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    /* ===================== GET ALL PRODUCTS ===================== */
    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    /* ===================== GET PRODUCT BY ID ===================== */
    @Override
    public Product getProductById(int productId) {
        return productRepository.findById(productId).orElse(null);
    }

    /* ===================== GET PRODUCT BY NAME ===================== */
    @Override
    public Product getProductByName(String productName) {
        return productRepository.findByProductName(productName).orElse(null);
    }
}
