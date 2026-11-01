package com.siwms.service;

import com.siwms.entity.Inventory;
import com.siwms.entity.Product;
import com.siwms.entity.Warehouse;
import com.siwms.repository.InventoryRepository;
import com.siwms.repository.ProductRepository;
import com.siwms.repository.WarehouseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;

    public InventoryService(InventoryRepository inventoryRepository,
                            ProductRepository productRepository,
                            WarehouseRepository warehouseRepository) {
        this.inventoryRepository = inventoryRepository;
        this.productRepository = productRepository;
        this.warehouseRepository = warehouseRepository;
    }

    public List<Inventory> getLowStockItems() {
        return inventoryRepository.findAll().stream()
                .filter(i -> i.getStockStatus() == Inventory.StockStatus.LOW_STOCK)
                .collect(Collectors.toList());
    }

    public List<Inventory> getOutOfStockItems() {
        return inventoryRepository.findAll().stream()
                .filter(i -> i.getStockStatus() == Inventory.StockStatus.OUT_OF_STOCK)
                .collect(Collectors.toList());
    }

    public List<Inventory> getExpiringItems(int days) {
        LocalDate cutoff = LocalDate.now().plusDays(days);
        return inventoryRepository.findAll().stream()
                .filter(i -> i.getExpiryDate() != null && !i.getExpiryDate().isAfter(cutoff))
                .collect(Collectors.toList());
    }

    public BigDecimal getTotalInventoryValue() {
        return inventoryRepository.findAll().stream()
                .map(Inventory::getInventoryValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Transactional
    public void increaseStock(Long productId, Long warehouseId, int quantity, String batchNumber) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));
        Warehouse warehouse = warehouseRepository.findById(warehouseId)
                .orElseThrow(() -> new RuntimeException("Warehouse not found: " + warehouseId));

        String batch = (batchNumber != null && !batchNumber.isBlank()) ? batchNumber : "DEFAULT";
        List<Inventory> existing = inventoryRepository.findByProductId(productId);
        Inventory item = existing.stream()
                .filter(i -> i.getWarehouse().getId().equals(warehouseId) && batch.equals(i.getBatchNumber()))
                .findFirst()
                .orElseGet(() -> {
                    Inventory inv = new Inventory();
                    inv.setProduct(product);
                    inv.setWarehouse(warehouse);
                    inv.setBatchNumber(batch);
                    inv.setQuantityOnHand(0);
                    inv.setQuantityReserved(0);
                    return inv;
                });

        item.setQuantityOnHand(item.getQuantityOnHand() + quantity);
        inventoryRepository.save(item);
    }

    @Transactional
    public void decreaseStock(Long productId, Long warehouseId, int quantity) {
        List<Inventory> existing = inventoryRepository.findByProductId(productId);
        Inventory item = existing.stream()
                .filter(i -> i.getWarehouse().getId().equals(warehouseId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Stock not found for product in warehouse"));

        if (item.getAvailableQuantity() < quantity) {
            throw new RuntimeException("Insufficient available stock");
        }
        item.setQuantityOnHand(item.getQuantityOnHand() - quantity);
        inventoryRepository.save(item);
    }

    public List<Map<String, Object>> getSmartReorderRecommendations() {

    List<Map<String, Object>> recommendations = new ArrayList<>();

    for (Inventory inventory : inventoryRepository.findAll()) {

        Product product = inventory.getProduct();

        if (product == null) {
            continue;
        }

        int currentStock = inventory.getQuantityOnHand() != null
                ? inventory.getQuantityOnHand()
                : 0;

        int reorderLevel = product.getReorderLevel() != null
                ? product.getReorderLevel()
                : 0;

        int maxStock = product.getMaxStockLevel() != null
                ? product.getMaxStockLevel()
                : 0;

        /*
         * First version:
         * Estimated daily usage is derived from the reorder level.
         *
         * This is a rule-based recommendation, not an AI prediction.
         */
        int estimatedDailyUsage = Math.max(1, reorderLevel / 7);

        double daysRemaining =
                (double) currentStock / estimatedDailyUsage;

        boolean reorderRequired = currentStock <= reorderLevel;

        int suggestedQuantity = Math.max(
                0,
                maxStock - currentStock
        );

        String recommendation;

        if (currentStock == 0) {
            recommendation = "URGENT REORDER";
        } else if (daysRemaining <= 3) {
            recommendation = "REORDER NOW";
        } else if (daysRemaining <= 7) {
            recommendation = "REORDER SOON";
        } else if (reorderRequired) {
            recommendation = "REORDER";
        } else {
            recommendation = "HEALTHY";
        }

        Map<String, Object> item = new HashMap<>();

        item.put("productId", product.getId());
        item.put("productName", product.getName());
        item.put("sku", product.getSku());

        item.put("warehouseId", inventory.getWarehouse().getId());
        item.put("warehouseName", inventory.getWarehouse().getName());

        item.put("currentStock", currentStock);
        item.put("reorderLevel", reorderLevel);
        item.put("maxStockLevel", maxStock);

        item.put("estimatedDailyUsage", estimatedDailyUsage);
        item.put("estimatedDaysRemaining",
                Math.round(daysRemaining * 10.0) / 10.0);

        item.put("suggestedOrderQuantity", suggestedQuantity);

        item.put("recommendation", recommendation);
        item.put("requiresReorder", reorderRequired);

        recommendations.add(item);
    }

    return recommendations;
}
}
