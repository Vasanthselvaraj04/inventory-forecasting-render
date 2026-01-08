package com.inventory.service;

import java.util.List;
import com.inventory.entity.Sale;

public interface SaleService {

    Sale addSale(Sale sale);

    List<Sale> getAllSales();

    List<Sale> getSalesByProduct(int productId);
}
