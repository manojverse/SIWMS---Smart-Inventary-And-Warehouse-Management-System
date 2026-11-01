package com.siwms.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory",
    uniqueConstraints = @UniqueConstraint(columnNames = {"product_id", "warehouse_id", "batch_number"}))
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @Column(nullable = false)
    private Integer quantityOnHand = 0;

    @Column(nullable = false)
    private Integer quantityReserved = 0;

    private String batchNumber;

    private LocalDate expiryDate;

    private String location;

    @UpdateTimestamp
    private LocalDateTime lastUpdated;

    public enum StockStatus {
        IN_STOCK, LOW_STOCK, OUT_OF_STOCK, OVERSTOCK
    }

    public Inventory() {}

    public Inventory(Long id, Product product, Warehouse warehouse, Integer quantityOnHand, Integer quantityReserved, String batchNumber, LocalDate expiryDate, String location, LocalDateTime lastUpdated) {
        this.id = id;
        this.product = product;
        this.warehouse = warehouse;
        if (quantityOnHand != null) this.quantityOnHand = quantityOnHand;
        if (quantityReserved != null) this.quantityReserved = quantityReserved;
        this.batchNumber = batchNumber;
        this.expiryDate = expiryDate;
        this.location = location;
        this.lastUpdated = lastUpdated;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public Warehouse getWarehouse() { return warehouse; }
    public void setWarehouse(Warehouse warehouse) { this.warehouse = warehouse; }
    public Integer getQuantityOnHand() { return quantityOnHand; }
    public void setQuantityOnHand(Integer quantityOnHand) { this.quantityOnHand = quantityOnHand; }
    public Integer getQuantityReserved() { return quantityReserved; }
    public void setQuantityReserved(Integer quantityReserved) { this.quantityReserved = quantityReserved; }
    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }
    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }

    public int getAvailableQuantity() {
        int qoh = quantityOnHand != null ? quantityOnHand : 0;
        int qr = quantityReserved != null ? quantityReserved : 0;
        return qoh - qr;
    }

    @Transient
    public StockStatus getStockStatus() {
        int available = getAvailableQuantity();
        int reorderLevel = (product != null && product.getReorderLevel() != null) ? product.getReorderLevel() : 0;
        int maxStock = (product != null && product.getMaxStockLevel() != null) ? product.getMaxStockLevel() : 0;
        int qoh = quantityOnHand != null ? quantityOnHand : 0;

        if (available <= 0) return StockStatus.OUT_OF_STOCK;
        if (available <= reorderLevel) return StockStatus.LOW_STOCK;
        if (maxStock > 0 && qoh >= maxStock) return StockStatus.OVERSTOCK;
        return StockStatus.IN_STOCK;
    }

    public BigDecimal getInventoryValue() {
        if (product == null || product.getCostPrice() == null) return BigDecimal.ZERO;
        int qoh = quantityOnHand != null ? quantityOnHand : 0;
        return product.getCostPrice().multiply(new BigDecimal(qoh));
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private Product product;
        private Warehouse warehouse;
        private Integer quantityOnHand = 0;
        private Integer quantityReserved = 0;
        private String batchNumber;
        private LocalDate expiryDate;
        private String location;
        private LocalDateTime lastUpdated;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder product(Product product) { this.product = product; return this; }
        public Builder warehouse(Warehouse warehouse) { this.warehouse = warehouse; return this; }
        public Builder quantityOnHand(Integer quantityOnHand) { this.quantityOnHand = quantityOnHand; return this; }
        public Builder quantityReserved(Integer quantityReserved) { this.quantityReserved = quantityReserved; return this; }
        public Builder batchNumber(String batchNumber) { this.batchNumber = batchNumber; return this; }
        public Builder expiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; return this; }
        public Builder location(String location) { this.location = location; return this; }
        public Builder lastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; return this; }

        public Inventory build() {
            return new Inventory(id, product, warehouse, quantityOnHand, quantityReserved, batchNumber, expiryDate, location, lastUpdated);
        }
    }
}
