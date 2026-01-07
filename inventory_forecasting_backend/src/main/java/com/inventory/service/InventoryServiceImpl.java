package com.inventory.service;

import java.util.List;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.inventory.entity.Inventory;
import com.inventory.entity.Product;
import com.inventory.repository.InventoryRepository;

@Service
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository inventoryRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public InventoryServiceImpl(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    // ===================== GET ALL INVENTORY =====================
    @Override
    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    // ===================== GET INVENTORY BY PRODUCT =====================
    @Override
    public Inventory getInventoryByProduct(int productId) {
        return inventoryRepository
                .findByProduct_ProductId(productId)
                .orElse(null);
    }

    // ===================== LOW STOCK =====================
    @Override
    public List<Inventory> getLowStockItems() {
        return inventoryRepository.findLowStockItems();
    }

    // ===================== INVENTORY OVERVIEW =====================
    @Override
    public List<Object[]> getInventoryOverview() {
        return entityManager.createNativeQuery(
            "SELECT p.product_id, p.product_name, p.category, p.unit_price, " +
            "i.current_stock, " +
            "CASE " +
            "  WHEN i.current_stock = 0 THEN 'OUT' " +
            "  WHEN i.current_stock <= 20 THEN 'LOW' " +
            "  ELSE 'OK' " +
            "END AS status " +
            "FROM products p " +
            "JOIN inventory i ON p.product_id = i.product_id"
        ).getResultList();
    }

    // ===================== UPDATE STOCK =====================
    @Override
    @Transactional
    public void updateStock(int productId, int stock) {

        Inventory inventory = inventoryRepository
                .findByProduct_ProductId(productId)
                .orElseThrow(() ->
                        new RuntimeException("Inventory not found for productId: " + productId)
                );

        inventory.setCurrentStock(stock);
        inventoryRepository.save(inventory);
    }

    // ===================== CSV UPSERT =====================
    @Override
    @Transactional
    public boolean upsertProductAndStock(
            String productName,
            String category,
            double unitPrice,
            int stock) {

        // 1️⃣ FIND PRODUCT BY NAME
        Product product = entityManager.createQuery(
                "SELECT p FROM Product p WHERE p.productName = :name",
                Product.class
        ).setParameter("name", productName)
         .getResultStream()
         .findFirst()
         .orElse(null);

        boolean isNewProduct = false;

        // 2️⃣ CREATE PRODUCT IF NOT EXISTS
        if (product == null) {
            product = new Product();
            product.setProductName(productName);
            product.setCategory(category);
            product.setUnitPrice(unitPrice);

            entityManager.persist(product);
            entityManager.flush(); // 🔥 VERY IMPORTANT
            isNewProduct = true;
        }

        // 3️⃣ FIND INVENTORY BY PRODUCT ID
        Inventory inventory = inventoryRepository
                .findByProduct_ProductId(product.getProductId())
                .orElse(null);

        // 4️⃣ CREATE / UPDATE INVENTORY
        if (inventory == null) {
            inventory = new Inventory();
            inventory.setProduct(product);
            inventory.setCurrentStock(stock);
        } else {
            inventory.setCurrentStock(stock);
        }

        inventoryRepository.save(inventory);

        return isNewProduct;
    }
    @Override
    @Transactional
    public int importInventoryByProductId(int productId, int stock) {

        Inventory inventory =
                inventoryRepository
                        .findByProduct_ProductId(productId)
                        .orElse(null);

        if (inventory == null) {
            inventory = new Inventory();
            inventory.setProduct(
                    entityManager.getReference(Product.class, productId)
            );
        }
        
        inventory.setCurrentStock(stock);
        inventoryRepository.save(inventory);

        return 1;
    }

}
