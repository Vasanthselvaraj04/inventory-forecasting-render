package com.inventory.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.inventory.entity.Inventory;
import com.inventory.entity.Sale;
import com.inventory.repository.ForecastRepository;
import com.inventory.repository.InventoryRepository;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.SaleRepository;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private ForecastRepository forecastRepository;

    @PersistenceContext
    private EntityManager entityManager;

    // =====================================================
    // DASHBOARD SUMMARY
    // =====================================================
    @Override
    @Transactional
    public Map<String, Object> getDashboardSummary() {

        // generate forecast safely
        generateLiveForecast();

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalProducts", productRepository.count());
        summary.put("totalSales", saleRepository.getTotalSalesQuantity());
        summary.put("lowStockCount", inventoryRepository.countLowStockItems());
        summary.put("forecastDemand", forecastRepository.getTotalForecastQuantity());

        return summary;
    }

    @Override
    public List<Inventory> getLowStockItems() {
        return inventoryRepository.findLowStockItems();
    }

    @Override
    public List<Sale> getRecentSales() {
        return saleRepository.findTop5ByOrderBySaleDateDesc();
    }

    @Override
    public Map<String, List<Object[]>> getChartData() {

        Map<String, List<Object[]>> chartData = new HashMap<>();
        chartData.put("sales", saleRepository.getSalesGroupedByDate());
        chartData.put("forecast", forecastRepository.getForecastGroupedByDays());

        return chartData;
    }
    @Override
    public List<Object[]> getLowStockWithDetails() {
        return inventoryRepository.findLowStockWithProductDetails();
    }

    // =====================================================
    // 🔥 LIVE FORECAST ENGINE (FIXED VERSION)
    // =====================================================
    private void generateLiveForecast() {

        // 1️⃣ SALES FROM LAST 7 DAYS
        List<Object[]> salesData = entityManager.createNativeQuery(
            "SELECT product_id, SUM(quantity_sold) " +
            "FROM sales " +
            "WHERE sale_date >= CURDATE() - INTERVAL 7 DAY " +
            "GROUP BY product_id"
        ).getResultList();

        Map<Integer, Integer> salesMap = new HashMap<>();

        for (Object[] row : salesData) {
            int productId = ((Number) row[0]).intValue();
            int totalSold = ((Number) row[1]).intValue();
            salesMap.put(productId, totalSold);
        }

        // 2️⃣ INVENTORY STOCK
        List<Object[]> inventoryData = entityManager.createNativeQuery(
            "SELECT product_id, current_stock FROM inventory"
        ).getResultList();

        for (Object[] row : inventoryData) {

            int productId = ((Number) row[0]).intValue();
            int stock = ((Number) row[1]).intValue();

            int totalSold = salesMap.getOrDefault(productId, 0);
            double avgDailySales = totalSold / 7.0;

            int predictedDemand = (int) Math.ceil(avgDailySales * 7);

            // 3️⃣ SAFE UPSERT (MATCHES TABLE)
            entityManager.createNativeQuery(
                "INSERT INTO forecast " +
                "(product_id, predicted_quantity, forecast_days, rule_applied, created_at) " +
                "VALUES (?, ?, ?, ?, NOW()) " +
                "ON DUPLICATE KEY UPDATE " +
                "predicted_quantity = VALUES(predicted_quantity), " +
                "forecast_days = VALUES(forecast_days), " +
                "rule_applied = VALUES(rule_applied)"
            )
            .setParameter(1, productId)
            .setParameter(2, predictedDemand)
            .setParameter(3, 7)
            .setParameter(4, "AVG_SALES_7_DAYS")
            .executeUpdate();
        }
    }
    @Override
    public List<Map<String, Object>> getStockRiskReport() {

        List<Object[]> data = entityManager.createNativeQuery(
            "SELECT i.product_id, i.current_stock, " +
            "COALESCE(SUM(s.quantity_sold), 0) AS total_sold " +
            "FROM inventory i " +
            "LEFT JOIN sales s ON i.product_id = s.product_id " +
            "AND s.sale_date >= CURDATE() - INTERVAL 7 DAY " +
            "GROUP BY i.product_id, i.current_stock"
        ).getResultList();

        List<Map<String, Object>> result = new java.util.ArrayList<>();

        for (Object[] row : data) {

            int productId = ((Number) row[0]).intValue();
            int currentStock = ((Number) row[1]).intValue();
            int totalSold = ((Number) row[2]).intValue();

            // ✅ SAFE AVG DAILY SALES
            double avgDailySales = totalSold / 7.0;

            // ✅ SAFE DAYS LEFT
            double daysLeft;
            if (avgDailySales <= 0) {
                daysLeft = currentStock > 0 ? 999 : 0;
            } else {
                daysLeft = currentStock / avgDailySales;
            }

            // ✅ RISK LEVEL
            String riskLevel;
            if (currentStock == 0) {
                riskLevel = "OUT";
            } else if (daysLeft <= 3) {
                riskLevel = "HIGH";
            } else if (daysLeft <= 7) {
                riskLevel = "MEDIUM";
            } else {
                riskLevel = "LOW";
            }

            Map<String, Object> item = new HashMap<>();
            item.put("productId", productId);
            item.put("currentStock", currentStock);
            item.put("avgDailySales", Math.round(avgDailySales * 100.0) / 100.0);
            item.put("daysLeft", daysLeft == 999 ? "Sufficient" : (int) Math.ceil(daysLeft));
            item.put("riskLevel", riskLevel);

            result.add(item);
        }

        return result;
    }

}
