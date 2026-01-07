package com.inventory.service;

import java.util.List;
import java.util.Map;
import com.inventory.entity.Inventory;
import com.inventory.entity.Sale;

public interface DashboardService {

    Map<String, Object> getDashboardSummary();

    List<Inventory> getLowStockItems();

    List<Sale> getRecentSales();

    Map<String, List<Object[]>> getChartData();

    // ✅ ADD THIS
    List<Object[]> getLowStockWithDetails();
    List<Map<String, Object>> getStockRiskReport();
}
