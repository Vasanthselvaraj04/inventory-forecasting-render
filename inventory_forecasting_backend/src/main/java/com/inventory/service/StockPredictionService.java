package com.inventory.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.springframework.stereotype.Service;

@Service
public class StockPredictionService {

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Stock Risk Logic:
     * current_stock < total_sales → RISK
     */
    public List<Map<String, Object>> getStockRiskReport() {

        List<Map<String, Object>> report = new ArrayList<>();

        List<Object[]> data = entityManager.createNativeQuery(
            "SELECT " +
            "i.product_id, " +
            "i.current_stock, " +
            "IFNULL(SUM(s.quantity_sold), 0) AS total_demand " +
            "FROM inventory i " +
            "LEFT JOIN sales s ON i.product_id = s.product_id " +
            "GROUP BY i.product_id, i.current_stock"
        ).getResultList();

        for (Object[] row : data) {

            int productId = ((Number) row[0]).intValue();
            int currentStock = ((Number) row[1]).intValue();
            int totalDemand = ((Number) row[2]).intValue();

            boolean risk = currentStock < totalDemand;

            Map<String, Object> item = new HashMap<>();
            item.put("productId", productId);
            item.put("currentStock", currentStock);
            item.put("requiredStock", totalDemand);
            item.put("risk", risk);

            report.add(item);
        }

        return report;
    }
}
