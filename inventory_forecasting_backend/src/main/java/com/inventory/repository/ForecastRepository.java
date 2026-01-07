package com.inventory.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.inventory.entity.Forecast;

@Repository
public interface ForecastRepository extends JpaRepository<Forecast, Integer> {

    // ✅ Sum of predicted quantity
    @Query("SELECT COALESCE(SUM(f.predictedQuantity), 0) FROM Forecast f")
    long getTotalForecastQuantity();

    // ✅ Forecast grouped by days
    @Query("SELECT f.forecastDays, SUM(f.predictedQuantity) FROM Forecast f GROUP BY f.forecastDays")
    List<Object[]> getForecastGroupedByDays();

    // ✅ REQUIRED: check existing forecast (prevents duplicates)
    Optional<Forecast> findByProductIdAndForecastDays(int productId, int forecastDays);
}
