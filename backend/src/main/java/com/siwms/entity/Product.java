package com.siwms.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String sku;

    @Column(unique = true, length = 50)
    private String barcode;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 1000)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @Column(length = 50)
    private String unitOfMeasure;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal costPrice = BigDecimal.ZERO;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal sellingPrice = BigDecimal.ZERO;

    @Column(nullable = false)
    private Integer reorderLevel = 0;

    @Column(nullable = false)
    private Integer maxStockLevel = 0;

    private boolean expiryTracked = false;

    private boolean batchTracked = false;

    @Lob
    private String imageUrl;

    @Column(nullable = false)
    private boolean active = true;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public Product() {}

    public Product(Long id, String sku, String barcode, String name, String description, Category category, Supplier supplier, String unitOfMeasure, BigDecimal costPrice, BigDecimal sellingPrice, Integer reorderLevel, Integer maxStockLevel, boolean expiryTracked, boolean batchTracked, String imageUrl, boolean active, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.sku = sku;
        this.barcode = barcode;
        this.name = name;
        this.description = description;
        this.category = category;
        this.supplier = supplier;
        this.unitOfMeasure = unitOfMeasure;
        if (costPrice != null) this.costPrice = costPrice;
        if (sellingPrice != null) this.sellingPrice = sellingPrice;
        if (reorderLevel != null) this.reorderLevel = reorderLevel;
        if (maxStockLevel != null) this.maxStockLevel = maxStockLevel;
        this.expiryTracked = expiryTracked;
        this.batchTracked = batchTracked;
        this.imageUrl = imageUrl;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    public String getBarcode() { return barcode; }
    public void setBarcode(String barcode) { this.barcode = barcode; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    public Supplier getSupplier() { return supplier; }
    public void setSupplier(Supplier supplier) { this.supplier = supplier; }
    public String getUnitOfMeasure() { return unitOfMeasure; }
    public void setUnitOfMeasure(String unitOfMeasure) { this.unitOfMeasure = unitOfMeasure; }
    public BigDecimal getCostPrice() { return costPrice; }
    public void setCostPrice(BigDecimal costPrice) { this.costPrice = costPrice; }
    public BigDecimal getSellingPrice() { return sellingPrice; }
    public void setSellingPrice(BigDecimal sellingPrice) { this.sellingPrice = sellingPrice; }
    public Integer getReorderLevel() { return reorderLevel; }
    public void setReorderLevel(Integer reorderLevel) { this.reorderLevel = reorderLevel; }
    public Integer getMaxStockLevel() { return maxStockLevel; }
    public void setMaxStockLevel(Integer maxStockLevel) { this.maxStockLevel = maxStockLevel; }
    public boolean isExpiryTracked() { return expiryTracked; }
    public void setExpiryTracked(boolean expiryTracked) { this.expiryTracked = expiryTracked; }
    public boolean isBatchTracked() { return batchTracked; }
    public void setBatchTracked(boolean batchTracked) { this.batchTracked = batchTracked; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public BigDecimal getMarginPercent() {
        if (sellingPrice == null || sellingPrice.compareTo(BigDecimal.ZERO) == 0) return BigDecimal.ZERO;
        if (costPrice == null) return BigDecimal.ZERO;
        return sellingPrice.subtract(costPrice)
            .divide(sellingPrice, 4, java.math.RoundingMode.HALF_UP)
            .multiply(new BigDecimal("100"));
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String sku;
        private String barcode;
        private String name;
        private String description;
        private Category category;
        private Supplier supplier;
        private String unitOfMeasure;
        private BigDecimal costPrice = BigDecimal.ZERO;
        private BigDecimal sellingPrice = BigDecimal.ZERO;
        private Integer reorderLevel = 0;
        private Integer maxStockLevel = 0;
        private boolean expiryTracked = false;
        private boolean batchTracked = false;
        private String imageUrl;
        private boolean active = true;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder sku(String sku) { this.sku = sku; return this; }
        public Builder barcode(String barcode) { this.barcode = barcode; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder category(Category category) { this.category = category; return this; }
        public Builder supplier(Supplier supplier) { this.supplier = supplier; return this; }
        public Builder unitOfMeasure(String unitOfMeasure) { this.unitOfMeasure = unitOfMeasure; return this; }
        public Builder costPrice(BigDecimal costPrice) { this.costPrice = costPrice; return this; }
        public Builder sellingPrice(BigDecimal sellingPrice) { this.sellingPrice = sellingPrice; return this; }
        public Builder reorderLevel(Integer reorderLevel) { this.reorderLevel = reorderLevel; return this; }
        public Builder maxStockLevel(Integer maxStockLevel) { this.maxStockLevel = maxStockLevel; return this; }
        public Builder expiryTracked(boolean expiryTracked) { this.expiryTracked = expiryTracked; return this; }
        public Builder batchTracked(boolean batchTracked) { this.batchTracked = batchTracked; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public Builder active(boolean active) { this.active = active; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Product build() {
            return new Product(id, sku, barcode, name, description, category, supplier, unitOfMeasure, costPrice, sellingPrice, reorderLevel, maxStockLevel, expiryTracked, batchTracked, imageUrl, active, createdAt, updatedAt);
        }
    }
}
