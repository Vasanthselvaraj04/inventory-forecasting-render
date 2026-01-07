package com.inventory.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.inventory.entity.Sale;

@Service
public class ForecastService {

    public int predictInventory(List<Sale> sales, int bufferPercent) {

        if (sales == null || sales.isEmpty()) {
            return 0;
        }

        int total = 0;
        for (Sale sale : sales) {
            total += sale.getQuantitySold();
        }

        int avgDailySales = total / sales.size();
        int buffer = (avgDailySales * bufferPercent) / 100;

        return avgDailySales + buffer;
    }
}
