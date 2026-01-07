package com.inventory.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "sales")
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sale_id")
    private int saleId;

    @Column(name = "product_id")
    private int productId;

    @Column(name = "sale_date")
    private LocalDate saleDate;

    @Column(name = "quantity_sold")
    private int quantitySold;

    // Getters & Setters
    public int getSaleId() {
        return saleId;
    }
    public void setSaleId(int saleId) {
        this.saleId = saleId;
    }

    public int getProductId() {
        return productId;
    }
    public void setProductId(int productId) {
        this.productId = productId;
    }

    public LocalDate getSaleDate() {
        return saleDate;
    }
    public void setSaleDate(LocalDate saleDate) {
        this.saleDate = saleDate;
    }

    public int getQuantitySold() {
        return quantitySold;
    }
    public void setQuantitySold(int quantitySold) {
        this.quantitySold = quantitySold;
    }
}
