package com.siwms.repository;

import com.siwms.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    Optional<Inventory> findByProductIdAndWarehouseIdAndBatchNumber(
        Long productId, Long warehouseId, String batchNumber);

    List<Inventory> findByWarehouseId(Long warehouseId);
    List<Inventory> findByProductId(Long productId);

    @Query("SELECT i FROM Inventory i WHERE i.quantityOnHand <= i.product.reorderLevel AND i.quantityOnHand > 0")
    List<Inventory> findLowStockItems();

    @Query("SELECT i FROM Inventory i WHERE i.quantityOnHand = 0")
    List<Inventory> findOutOfStockItems();

    @Query("SELECT i FROM Inventory i WHERE i.expiryDate <= :expiryDate AND i.quantityOnHand > 0")
    List<Inventory> findExpiringItems(@Param("expiryDate") LocalDate expiryDate);

    @Query("SELECT i FROM Inventory i WHERE i.quantityOnHand >= i.product.maxStockLevel")
    List<Inventory> findOverstockItems();

    @Query("SELECT SUM(i.quantityOnHand * i.product.costPrice) FROM Inventory i")
    java.math.BigDecimal getTotalInventoryValue();

    @Query("SELECT i FROM Inventory i WHERE i.product.id = :productId AND i.warehouse.id = :warehouseId ORDER BY i.expiryDate ASC NULLS LAST")
    List<Inventory> findByProductAndWarehouse(@Param("productId") Long productId, @Param("warehouseId") Long warehouseId);
}
