package com.inventory.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.inventory.entity.Sale;

public interface SaleRepository extends JpaRepository<Sale, Integer> {

    // Total sales for dashboard cards
    @Query("SELECT COALESCE(SUM(s.quantitySold), 0) FROM Sale s")
    long getTotalSalesQuantity();

    // Recent sales
    List<Sale> findTop5ByOrderBySaleDateDesc();

    // Sales by product
    List<Sale> findByProductId(int productId);

    // ✅ SALES CHART (GROUP BY DATE)
    @Query("""
        SELECT s.saleDate, SUM(s.quantitySold)
        FROM Sale s
        GROUP BY s.saleDate
        ORDER BY s.saleDate
    """)
    List<Object[]> getSalesGroupedByDate();
    
    @Query("SELECT COALESCE(SUM(s.quantitySold),0) FROM Sale s WHERE s.productId = :productId")
    long getTotalSalesByProduct(int productId);

}
