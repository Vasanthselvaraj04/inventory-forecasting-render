package com.inventory.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.inventory.entity.Sale;
import com.inventory.repository.SaleRepository;

@Service
public class SaleService {

    @Autowired
    private SaleRepository saleRepository;

    // Save sale
    public Sale saveSale(Sale sale) {
        return saleRepository.save(sale);
    }

    // Get all sales
    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }

    // Get sales by product
    public List<Sale> getSalesByProduct(int productId) {
        return saleRepository.findByProductId(productId);
    }
}
