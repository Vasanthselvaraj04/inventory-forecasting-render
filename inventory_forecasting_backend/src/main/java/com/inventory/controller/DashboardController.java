package com.inventory.controller;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.inventory.entity.Sale;
import com.inventory.service.DashboardService;
import com.inventory.service.StockPredictionService;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class DashboardController {

    // ---------------- SERVICES ----------------
    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private StockPredictionService stockPredictionService;

    // ---------------- SUMMARY ----------------
    @GetMapping("/summary")
    public Map<String, Object> getDashboardSummary() {
        return dashboardService.getDashboardSummary();
    }

    // ---------------- CHART DATA ----------------
    @GetMapping("/chart-data")
    public Map<String, List<Object[]>> getChartData() {
        return dashboardService.getChartData();
    }

    // ---------------- LOW STOCK ITEMS (WITH DETAILS) ----------------
    @GetMapping("/low-stock")
    public List<Map<String, Object>> getLowStockItems() {

        List<Object[]> data = dashboardService.getLowStockWithDetails();
        List<Map<String, Object>> response = new ArrayList<>();

        for (Object[] row : data) {
            Map<String, Object> item = new HashMap<>();
            item.put("productId", row[0]);
            item.put("productName", row[1]);
            item.put("category", row[2]);
            item.put("currentStock", row[3]);
            response.add(item);
        }

        return response;
    }

    // ---------------- RECENT SALES ----------------
    @GetMapping("/recent-sales")
    public List<Sale> getRecentSales() {
        return dashboardService.getRecentSales();
    }

    // ---------------- STOCK RISK ----------------
    @GetMapping("/stock-risk")
    public List<Map<String, Object>> getStockRiskReport() {
        return dashboardService.getStockRiskReport();
    }

}
