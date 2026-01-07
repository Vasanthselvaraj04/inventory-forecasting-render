package com.inventory.service;

import java.util.List;
import com.inventory.entity.Inventory;

public interface InventoryService {

    List<Inventory> getAllInventory();

    Inventory getInventoryByProduct(int productId);

    List<Inventory> getLowStockItems();

    List<Object[]> getInventoryOverview();

    void updateStock(int productId, int stock);

    // ✅ ADD THIS (CRITICAL)
    boolean upsertProductAndStock(
            String productName,
            String category,
            double unitPrice,
            int stock
    );
    int importInventoryByProductId(int productId, int stock);
}
