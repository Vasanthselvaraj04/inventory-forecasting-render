package com.inventory.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.inventory.entity.Sale;
import com.inventory.repository.SaleRepository;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "http://localhost:3000")
public class SaleController {

    private final SaleRepository saleRepository;

    public SaleController(SaleRepository saleRepository) {
        this.saleRepository = saleRepository;
    }

    /* ===================== GET : ALL SALES ===================== */
    @GetMapping
    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }

    /* ===================== GET : SALES BY PRODUCT ===================== */
    @GetMapping("/product/{productId}")
    public List<Sale> getSalesByProduct(@PathVariable int productId) {
        return saleRepository.findByProductId(productId);
    }
}
