package com.siwms.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "purchase_orders")
public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String poNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse destinationWarehouse;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private POStatus status = POStatus.DRAFT;

    private LocalDate orderDate;
    private LocalDate expectedDeliveryDate;
    private LocalDate actualDeliveryDate;

    @Column(precision = 15, scale = 2)
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(precision = 15, scale = 2)
    private BigDecimal paidAmount = BigDecimal.ZERO;

    private Integer paymentTermsDays = 30;

    @Column(length = 1000)
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    @OneToMany(mappedBy = "purchaseOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PurchaseOrderItem> items = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum POStatus {
        DRAFT, PENDING, APPROVED, ORDERED, RECEIVED, CANCELLED
    }

    public PurchaseOrder() {}

    public PurchaseOrder(Long id, String poNumber, Supplier supplier, Warehouse destinationWarehouse, POStatus status, LocalDate orderDate, LocalDate expectedDeliveryDate, LocalDate actualDeliveryDate, BigDecimal totalAmount, BigDecimal paidAmount, Integer paymentTermsDays, String notes, User createdBy, User approvedBy, List<PurchaseOrderItem> items, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.poNumber = poNumber;
        this.supplier = supplier;
        this.destinationWarehouse = destinationWarehouse;
        if (status != null) this.status = status;
        this.orderDate = orderDate;
        this.expectedDeliveryDate = expectedDeliveryDate;
        this.actualDeliveryDate = actualDeliveryDate;
        if (totalAmount != null) this.totalAmount = totalAmount;
        if (paidAmount != null) this.paidAmount = paidAmount;
        if (paymentTermsDays != null) this.paymentTermsDays = paymentTermsDays;
        this.notes = notes;
        this.createdBy = createdBy;
        this.approvedBy = approvedBy;
        if (items != null) this.items = items;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getPoNumber() { return poNumber; }
    public void setPoNumber(String poNumber) { this.poNumber = poNumber; }
    public Supplier getSupplier() { return supplier; }
    public void setSupplier(Supplier supplier) { this.supplier = supplier; }
    public Warehouse getDestinationWarehouse() { return destinationWarehouse; }
    public void setDestinationWarehouse(Warehouse destinationWarehouse) { this.destinationWarehouse = destinationWarehouse; }
    public POStatus getStatus() { return status; }
    public void setStatus(POStatus status) { this.status = status; }
    public LocalDate getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDate orderDate) { this.orderDate = orderDate; }
    public LocalDate getExpectedDeliveryDate() { return expectedDeliveryDate; }
    public void setExpectedDeliveryDate(LocalDate expectedDeliveryDate) { this.expectedDeliveryDate = expectedDeliveryDate; }
    public LocalDate getActualDeliveryDate() { return actualDeliveryDate; }
    public void setActualDeliveryDate(LocalDate actualDeliveryDate) { this.actualDeliveryDate = actualDeliveryDate; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public BigDecimal getPaidAmount() { return paidAmount; }
    public void setPaidAmount(BigDecimal paidAmount) { this.paidAmount = paidAmount; }
    public Integer getPaymentTermsDays() { return paymentTermsDays; }
    public void setPaymentTermsDays(Integer paymentTermsDays) { this.paymentTermsDays = paymentTermsDays; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }
    public User getApprovedBy() { return approvedBy; }
    public void setApprovedBy(User approvedBy) { this.approvedBy = approvedBy; }
    public List<PurchaseOrderItem> getItems() { return items; }
    public void setItems(List<PurchaseOrderItem> items) { this.items = items; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public BigDecimal getOutstandingBalance() {
        if (totalAmount == null) return BigDecimal.ZERO;
        if (paidAmount == null) return totalAmount;
        return totalAmount.subtract(paidAmount);
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String poNumber;
        private Supplier supplier;
        private Warehouse destinationWarehouse;
        private POStatus status = POStatus.DRAFT;
        private LocalDate orderDate;
        private LocalDate expectedDeliveryDate;
        private LocalDate actualDeliveryDate;
        private BigDecimal totalAmount = BigDecimal.ZERO;
        private BigDecimal paidAmount = BigDecimal.ZERO;
        private Integer paymentTermsDays = 30;
        private String notes;
        private User createdBy;
        private User approvedBy;
        private List<PurchaseOrderItem> items = new ArrayList<>();
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder poNumber(String poNumber) { this.poNumber = poNumber; return this; }
        public Builder supplier(Supplier supplier) { this.supplier = supplier; return this; }
        public Builder destinationWarehouse(Warehouse destinationWarehouse) { this.destinationWarehouse = destinationWarehouse; return this; }
        public Builder status(POStatus status) { this.status = status; return this; }
        public Builder orderDate(LocalDate orderDate) { this.orderDate = orderDate; return this; }
        public Builder expectedDeliveryDate(LocalDate expectedDeliveryDate) { this.expectedDeliveryDate = expectedDeliveryDate; return this; }
        public Builder actualDeliveryDate(LocalDate actualDeliveryDate) { this.actualDeliveryDate = actualDeliveryDate; return this; }
        public Builder totalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; return this; }
        public Builder paidAmount(BigDecimal paidAmount) { this.paidAmount = paidAmount; return this; }
        public Builder paymentTermsDays(Integer paymentTermsDays) { this.paymentTermsDays = paymentTermsDays; return this; }
        public Builder notes(String notes) { this.notes = notes; return this; }
        public Builder createdBy(User createdBy) { this.createdBy = createdBy; return this; }
        public Builder approvedBy(User approvedBy) { this.approvedBy = approvedBy; return this; }
        public Builder items(List<PurchaseOrderItem> items) { this.items = items; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public PurchaseOrder build() {
            return new PurchaseOrder(id, poNumber, supplier, destinationWarehouse, status, orderDate, expectedDeliveryDate, actualDeliveryDate, totalAmount, paidAmount, paymentTermsDays, notes, createdBy, approvedBy, items, createdAt, updatedAt);
        }
    }
}
