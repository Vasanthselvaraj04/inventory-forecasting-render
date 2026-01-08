package com.inventory.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.inventory.entity.Sale;
import com.inventory.repository.SaleRepository;

@Service
public class SaleService {

    private final SaleRepository saleRepository;

    public SaleService(SaleRepository saleRepository) {
        this.saleRepository = saleRepository;
    }

    // ADD SALE
    public Sale addSale(Sale sale) {
        return saleRepository.save(sale);
    }

    // GET ALL SALES
    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }

    // GET SALES BY PRODUCT
    public List<Sale> getSalesByProduct(int productId) {
        return saleRepository.findByProductId(productId);
    }
}
