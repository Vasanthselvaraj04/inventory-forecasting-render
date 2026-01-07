package com.inventory.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.inventory.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    /* ===================== FIND BY PRODUCT ID ===================== */
    Optional<Product> findByProductId(int productId);

    /* ===================== FIND BY PRODUCT NAME ===================== */
    Optional<Product> findByProductName(String productName);
}
