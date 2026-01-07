package com.inventory.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "forecast")
public class Forecast {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "forecast_id")
    private int forecastId;

    @Column(name = "product_id")
    private int productId;

    @Column(name = "predicted_quantity")
    private int predictedQuantity;

    @Column(name = "forecast_days")
    private int forecastDays;

    @Column(name = "rule_applied")
    private String ruleApplied;

    // Getters & Setters
    public int getForecastId() {
        return forecastId;
    }
    public void setForecastId(int forecastId) {
        this.forecastId = forecastId;
    }

    public int getProductId() {
        return productId;
    }
    public void setProductId(int productId) {
        this.productId = productId;
    }

    public int getPredictedQuantity() {
        return predictedQuantity;
    }
    public void setPredictedQuantity(int predictedQuantity) {
        this.predictedQuantity = predictedQuantity;
    }

    public int getForecastDays() {
        return forecastDays;
    }
    public void setForecastDays(int forecastDays) {
        this.forecastDays = forecastDays;
    }

    public String getRuleApplied() {
        return ruleApplied;
    }
    public void setRuleApplied(String ruleApplied) {
        this.ruleApplied = ruleApplied;
    }
}
