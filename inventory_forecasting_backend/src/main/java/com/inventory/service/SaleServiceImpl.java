package com.inventory.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.inventory.entity.Sale;
import com.inventory.repository.SaleRepository;

@Service
public class SaleServiceImpl implements SaleService {

    private final SaleRepository saleRepository;

    public SaleServiceImpl(SaleRepository saleRepository) {
        this.saleRepository = saleRepository;
    }

    @Override
    public Sale addSale(Sale sale) {
        return saleRepository.save(sale);
    }

    @Override
    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }

    @Override
    public List<Sale> getSalesByProduct(int productId) {
        return saleRepository.findByProductId(productId);
    }
}
