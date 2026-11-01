package com.siwms.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "purchase_order_items")
public class PurchaseOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_order_id", nullable = false)
    private PurchaseOrder purchaseOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer orderedQuantity;

    private Integer receivedQuantity = 0;

    private Integer rejectedQuantity = 0;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal unitPrice;

    @Column(precision = 15, scale = 2)
    private BigDecimal lineTotal;

    private String batchNumber;

    public PurchaseOrderItem() {}

    public PurchaseOrderItem(Long id, PurchaseOrder purchaseOrder, Product product, Integer orderedQuantity, Integer receivedQuantity, Integer rejectedQuantity, BigDecimal unitPrice, BigDecimal lineTotal, String batchNumber) {
        this.id = id;
        this.purchaseOrder = purchaseOrder;
        this.product = product;
        this.orderedQuantity = orderedQuantity;
        if (receivedQuantity != null) this.receivedQuantity = receivedQuantity;
        if (rejectedQuantity != null) this.rejectedQuantity = rejectedQuantity;
        this.unitPrice = unitPrice;
        this.lineTotal = lineTotal;
        this.batchNumber = batchNumber;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public PurchaseOrder getPurchaseOrder() { return purchaseOrder; }
    public void setPurchaseOrder(PurchaseOrder purchaseOrder) { this.purchaseOrder = purchaseOrder; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public Integer getOrderedQuantity() { return orderedQuantity; }
    public void setOrderedQuantity(Integer orderedQuantity) { this.orderedQuantity = orderedQuantity; }
    public Integer getReceivedQuantity() { return receivedQuantity; }
    public void setReceivedQuantity(Integer receivedQuantity) { this.receivedQuantity = receivedQuantity; }
    public Integer getRejectedQuantity() { return rejectedQuantity; }
    public void setRejectedQuantity(Integer rejectedQuantity) { this.rejectedQuantity = rejectedQuantity; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    public BigDecimal getLineTotal() { return lineTotal; }
    public void setLineTotal(BigDecimal lineTotal) { this.lineTotal = lineTotal; }
    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }

    @PrePersist
    @PreUpdate
    public void calculateLineTotal() {
        if (unitPrice != null && orderedQuantity != null) {
            this.lineTotal = unitPrice.multiply(new BigDecimal(orderedQuantity));
        }
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private PurchaseOrder purchaseOrder;
        private Product product;
        private Integer orderedQuantity;
        private Integer receivedQuantity = 0;
        private Integer rejectedQuantity = 0;
        private BigDecimal unitPrice;
        private BigDecimal lineTotal;
        private String batchNumber;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder purchaseOrder(PurchaseOrder purchaseOrder) { this.purchaseOrder = purchaseOrder; return this; }
        public Builder product(Product product) { this.product = product; return this; }
        public Builder orderedQuantity(Integer orderedQuantity) { this.orderedQuantity = orderedQuantity; return this; }
        public Builder receivedQuantity(Integer receivedQuantity) { this.receivedQuantity = receivedQuantity; return this; }
        public Builder rejectedQuantity(Integer rejectedQuantity) { this.rejectedQuantity = rejectedQuantity; return this; }
        public Builder unitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; return this; }
        public Builder lineTotal(BigDecimal lineTotal) { this.lineTotal = lineTotal; return this; }
        public Builder batchNumber(String batchNumber) { this.batchNumber = batchNumber; return this; }

        public PurchaseOrderItem build() {
            return new PurchaseOrderItem(id, purchaseOrder, product, orderedQuantity, receivedQuantity, rejectedQuantity, unitPrice, lineTotal, batchNumber);
        }
    }
}
