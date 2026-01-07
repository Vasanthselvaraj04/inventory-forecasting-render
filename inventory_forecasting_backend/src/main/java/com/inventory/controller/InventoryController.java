package com.inventory.controller;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.inventory.service.InventoryService;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*") // ✅ FIXED: works for localhost + Railway
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
    public ResponseEntity<Map<String, Object>> importInventoryCSV(
            @RequestParam("file") MultipartFile file) {

        Map<String, Object> result = new HashMap<>();
        int updated = 0;
        int failed = 0;

        if (file == null || file.isEmpty()) {
            result.put("error", "CSV file is empty");
            return ResponseEntity.badRequest().body(result);
        }

        try (BufferedReader br =
                new BufferedReader(new InputStreamReader(file.getInputStream()))) {

            String line;
            boolean isHeader = true;

            while ((line = br.readLine()) != null) {

                if (isHeader) {
                    isHeader = false;
                    continue;
                }

                if (line.trim().isEmpty()) {
                    continue;
                }

                String[] data = line.split(",");

                /*
                 * SUPPORTED CSV FORMATS:
                 *
                 * 1) product_id,current_stock
                 * 2) inventory_id,product_id,current_stock,last_updated
                 */

                int productId;
                int stock;

                try {
                    if (data.length == 2) {
                        // product_id,current_stock
                        productId = Integer.parseInt(data[0].trim());
                        stock = Integer.parseInt(data[1].trim());
                    } else if (data.length >= 3) {
                        // inventory_id,product_id,current_stock,...
                        productId = Integer.parseInt(data[1].trim());
                        stock = Integer.parseInt(data[2].trim());
                    } else {
                        failed++;
                        continue;
                    }

                    int rowsAffected =
                            inventoryService.importInventoryByProductId(
                                    productId, stock);

                    if (rowsAffected > 0) {
                        updated++;
                    } else {
                        failed++;
                    }

                } catch (Exception rowEx) {
                    failed++;
                }
            }

            result.put("updated", updated);
            result.put("failed", failed);

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            result.put("error", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(result);
        }
    }

    // ===================== UPDATE STOCK (MANUAL) =====================
    @PutMapping("/{productId}")
    public void updateInventoryStock(
            @PathVariable int productId,
            @RequestBody Map<String, Integer> body) {

        int stock = body.get("stock");
        inventoryService.updateStock(productId, stock);
    }
}
