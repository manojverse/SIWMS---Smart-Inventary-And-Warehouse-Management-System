package com.siwms.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_transfers")
public class StockTransfer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String transferNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_warehouse_id", nullable = false)
    private Warehouse fromWarehouse;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_warehouse_id", nullable = false)
    private Warehouse toWarehouse;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransferStatus status = TransferStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requested_by")
    private User requestedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    private LocalDateTime requestedAt;
    private LocalDateTime approvedAt;
    private LocalDateTime completedAt;

    @Column(length = 500)
    private String reason;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public enum TransferStatus {
        PENDING, APPROVED, IN_TRANSIT, RECEIVED, CANCELLED
    }

    public StockTransfer() {}

    public StockTransfer(Long id, String transferNumber, Warehouse fromWarehouse, Warehouse toWarehouse, Product product, Integer quantity, TransferStatus status, User requestedBy, User approvedBy, LocalDateTime requestedAt, LocalDateTime approvedAt, LocalDateTime completedAt, String reason, LocalDateTime createdAt) {
        this.id = id;
        this.transferNumber = transferNumber;
        this.fromWarehouse = fromWarehouse;
        this.toWarehouse = toWarehouse;
        this.product = product;
        this.quantity = quantity;
        if (status != null) this.status = status;
        this.requestedBy = requestedBy;
        this.approvedBy = approvedBy;
        this.requestedAt = requestedAt;
        this.approvedAt = approvedAt;
        this.completedAt = completedAt;
        this.reason = reason;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTransferNumber() { return transferNumber; }
    public void setTransferNumber(String transferNumber) { this.transferNumber = transferNumber; }
    public Warehouse getFromWarehouse() { return fromWarehouse; }
    public void setFromWarehouse(Warehouse fromWarehouse) { this.fromWarehouse = fromWarehouse; }
    public Warehouse getToWarehouse() { return toWarehouse; }
    public void setToWarehouse(Warehouse toWarehouse) { this.toWarehouse = toWarehouse; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public TransferStatus getStatus() { return status; }
    public void setStatus(TransferStatus status) { this.status = status; }
    public User getRequestedBy() { return requestedBy; }
    public void setRequestedBy(User requestedBy) { this.requestedBy = requestedBy; }
    public User getApprovedBy() { return approvedBy; }
    public void setApprovedBy(User approvedBy) { this.approvedBy = approvedBy; }
    public LocalDateTime getRequestedAt() { return requestedAt; }
    public void setRequestedAt(LocalDateTime requestedAt) { this.requestedAt = requestedAt; }
    public LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String transferNumber;
        private Warehouse fromWarehouse;
        private Warehouse toWarehouse;
        private Product product;
        private Integer quantity;
        private TransferStatus status = TransferStatus.PENDING;
        private User requestedBy;
        private User approvedBy;
        private LocalDateTime requestedAt;
        private LocalDateTime approvedAt;
        private LocalDateTime completedAt;
        private String reason;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder transferNumber(String transferNumber) { this.transferNumber = transferNumber; return this; }
        public Builder fromWarehouse(Warehouse fromWarehouse) { this.fromWarehouse = fromWarehouse; return this; }
        public Builder toWarehouse(Warehouse toWarehouse) { this.toWarehouse = toWarehouse; return this; }
        public Builder product(Product product) { this.product = product; return this; }
        public Builder quantity(Integer quantity) { this.quantity = quantity; return this; }
        public Builder status(TransferStatus status) { this.status = status; return this; }
        public Builder requestedBy(User requestedBy) { this.requestedBy = requestedBy; return this; }
        public Builder approvedBy(User approvedBy) { this.approvedBy = approvedBy; return this; }
        public Builder requestedAt(LocalDateTime requestedAt) { this.requestedAt = requestedAt; return this; }
        public Builder approvedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; return this; }
        public Builder completedAt(LocalDateTime completedAt) { this.completedAt = completedAt; return this; }
        public Builder reason(String reason) { this.reason = reason; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public StockTransfer build() {
            return new StockTransfer(id, transferNumber, fromWarehouse, toWarehouse, product, quantity, status, requestedBy, approvedBy, requestedAt, approvedAt, completedAt, reason, createdAt);
        }
    }
}
