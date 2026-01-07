package com.inventory.controller;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.inventory.service.InventoryService;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "http://localhost:3000")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    // ===================== GET INVENTORY =====================
    @GetMapping
    public List<Map<String, Object>> getInventory() {

        List<Object[]> rawData = inventoryService.getInventoryOverview();
        List<Map<String, Object>> response = new ArrayList<>();

        for (Object[] row : rawData) {
            Map<String, Object> item = new HashMap<>();
            item.put("productId", row[0]);
            item.put("productName", row[1]);
            item.put("category", row[2]);
            item.put("unitPrice", row[3]);
            item.put("currentStock", row[4]);
            item.put("status", row[5]);
            response.add(item);
        }

        return response;
    }

    // ===================== CSV IMPORT =====================
    @PostMapping("/import")
    public Map<String, Object> importInventoryCSV(
            @RequestParam("file") MultipartFile file) {

        Map<String, Object> result = new HashMap<>();
        int updated = 0;
        int failed = 0;

        try (BufferedReader br =
                new BufferedReader(new InputStreamReader(file.getInputStream()))) {

            String line;
            boolean isHeader = true;

            while ((line = br.readLine()) != null) {

                if (isHeader) {
                    isHeader = false;
                    continue;
                }

                String[] data = line.split(",");

                // product_id,current_stock
                if (data.length < 2) {
                    failed++;
                    continue;
                }

                int productId = Integer.parseInt(data[0].trim());
                int stock = Integer.parseInt(data[1].trim());

                inventoryService.importInventoryByProductId(productId, stock);
                updated++;
            }

            result.put("updated", updated);
            result.put("failed", failed);

        } catch (Exception e) {
            result.put("error", e.getMessage());
        }

        return result;
    }
    @PutMapping("/{productId}")
    public void updateInventoryStock(
            @PathVariable int productId,
            @RequestBody Map<String, Integer> body) {

        int stock = body.get("stock");
        inventoryService.updateStock(productId, stock);
    }

}
