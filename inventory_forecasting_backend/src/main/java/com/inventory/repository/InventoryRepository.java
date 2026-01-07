package com.inventory.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.inventory.entity.Inventory;
import com.inventory.entity.Product;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Integer> {

    Optional<Inventory> findByProduct_ProductId(int productId);

    @Query("SELECT i FROM Inventory i WHERE i.currentStock <= 20")
    List<Inventory> findLowStockItems();

    @Query("SELECT COUNT(i) FROM Inventory i WHERE i.currentStock <= 20")
    long countLowStockItems();

    @Query(value = """
        SELECT 
            p.product_id,
            p.product_name,
            p.category,
            i.current_stock
        FROM inventory i
        JOIN products p ON p.product_id = i.product_id
        WHERE i.current_stock <= 20
    """, nativeQuery = true)
    List<Object[]> findLowStockWithProductDetails();
}
