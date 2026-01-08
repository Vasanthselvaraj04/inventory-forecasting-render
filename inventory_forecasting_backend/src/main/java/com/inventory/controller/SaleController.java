package com.inventory.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.inventory.entity.Sale;
import com.inventory.service.SaleService;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "*")
public class SaleController {

    private final SaleService saleService;

    public SaleController(SaleService saleService) {
        this.saleService = saleService;
    }

    // GET ALL SALES
    @GetMapping
    public List<Sale> getAllSales() {
        return saleService.getAllSales();
    }

    // ADD SALE
    @PostMapping
    public Sale addSale(@RequestBody Sale sale) {
        return saleService.addSale(sale);
    }

    // GET SALES BY PRODUCT
    @GetMapping("/product/{productId}")
    public List<Sale> getSalesByProduct(@PathVariable int productId) {
        return saleService.getSalesByProduct(productId);
    }
}
