package com.siwms.controller;

import com.siwms.entity.Inventory;
import com.siwms.repository.InventoryRepository;
import com.siwms.service.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/inventory")
public class InventoryController {

    private final InventoryRepository inventoryRepository;
    private final InventoryService inventoryService;

    public InventoryController(InventoryRepository inventoryRepository, InventoryService inventoryService) {
        this.inventoryRepository = inventoryRepository;
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public ResponseEntity<List<Inventory>> getAll() {
        return ResponseEntity.ok(inventoryRepository.findAll());
    }

    @GetMapping("/warehouse/{warehouseId}")
    public ResponseEntity<List<Inventory>> getByWarehouse(@PathVariable Long warehouseId) {
        return ResponseEntity.ok(inventoryRepository.findByWarehouseId(warehouseId));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Inventory>> getByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(inventoryRepository.findByProductId(productId));
    }

    @GetMapping("/alerts/low-stock")
    public ResponseEntity<List<Inventory>> getLowStock() {
        return ResponseEntity.ok(inventoryService.getLowStockItems());
    }

    @GetMapping("/alerts/out-of-stock")
    public ResponseEntity<List<Inventory>> getOutOfStock() {
        return ResponseEntity.ok(inventoryService.getOutOfStockItems());
    }

    @GetMapping("/alerts/expiring")
    public ResponseEntity<List<Inventory>> getExpiring(@RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(inventoryService.getExpiringItems(days));
    }

    @GetMapping("/forecast")
    public ResponseEntity<List<Map<String, Object>>> getSmartReorderRecommendations() {
    return ResponseEntity.ok(
            inventoryService.getSmartReorderRecommendations()
    );
}

    @GetMapping("/valuation")
    @PreAuthorize("hasAnyRole('ADMIN', 'FINANCE_MANAGER')")
    public ResponseEntity<Map<String, Object>> getValuation() {
        BigDecimal totalValue = inventoryService.getTotalInventoryValue();
        long lowStockCount = inventoryService.getLowStockItems().size();
        long outOfStockCount = inventoryService.getOutOfStockItems().size();
        return ResponseEntity.ok(Map.of(
            "totalValue", totalValue,
            "lowStockCount", lowStockCount,
            "outOfStockCount", outOfStockCount
        ));
    }

    @PostMapping("/adjust")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_MANAGER', 'INVENTORY_STAFF')")
    public ResponseEntity<?> adjustStock(
            @RequestParam Long productId,
            @RequestParam Long warehouseId,
            @RequestParam int quantity,
            @RequestParam(required = false) String batchNumber,
            @RequestParam String reason) {
        try {
            if (quantity > 0) {
                inventoryService.increaseStock(productId, warehouseId, quantity, batchNumber);
            } else if (quantity < 0) {
                inventoryService.decreaseStock(productId, warehouseId, Math.abs(quantity));
            }
            return ResponseEntity.ok(Map.of("message", "Stock adjusted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
