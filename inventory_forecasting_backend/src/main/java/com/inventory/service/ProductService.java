package com.inventory.service;

import java.util.List;

import com.inventory.entity.Product;

public interface ProductService {

    /* ===================== GET ALL PRODUCTS ===================== */
    List<Product> getAllProducts();

    /* ===================== GET PRODUCT BY ID ===================== */
    Product getProductById(int productId);

    /* ===================== GET PRODUCT BY NAME ===================== */
    Product getProductByName(String productName);
}
