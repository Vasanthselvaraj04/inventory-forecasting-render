package com.inventory.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.*;

import com.inventory.entity.Forecast;
import com.inventory.entity.Sale;
import com.inventory.repository.ForecastRepository;
import com.inventory.service.ForecastService;
import com.inventory.service.SaleService;

@RestController
@RequestMapping("/api/forecast")
@CrossOrigin(origins = "http://localhost:3000")
public class ForecastController {

    private final SaleService saleService;
    private final ForecastService forecastService;
    private final ForecastRepository forecastRepository;

    public ForecastController(
            SaleService saleService,
            ForecastService forecastService,
            ForecastRepository forecastRepository) {

        this.saleService = saleService;
        this.forecastService = forecastService;
        this.forecastRepository = forecastRepository;
    }

    /* ===================== GET : FETCH FORECASTS ===================== */
    @GetMapping
    public List<Forecast> getAllForecasts() {
        return forecastRepository.findAll();
    }

    /* ===================== POST : GENERATE / UPDATE FORECAST ===================== */
    @PostMapping("/{productId}")
    public Forecast generateForecast(@PathVariable int productId) {

        int forecastDays = 7;

        // Check if forecast already exists for this product + days
        Optional<Forecast> existingForecast =
                forecastRepository.findByProductIdAndForecastDays(productId, forecastDays);

        // Get sales data
        List<Sale> sales = saleService.getSalesByProduct(productId);

        // Predict quantity
        int predictedQty = forecastService.predictInventory(sales, 20);

        Forecast forecast;

        if (existingForecast.isPresent()) {
            // UPDATE existing forecast
            forecast = existingForecast.get();
            forecast.setPredictedQuantity(predictedQty);
            forecast.setRuleApplied("AVG_SALES_7_DAYS");
        } else {
            // INSERT new forecast
            forecast = new Forecast();
            forecast.setProductId(productId);
            forecast.setForecastDays(forecastDays);
            forecast.setPredictedQuantity(predictedQty);
            forecast.setRuleApplied("AVG_SALES_7_DAYS");
        }

        return forecastRepository.save(forecast);
    }
}
