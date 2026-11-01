package com.siwms.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_audits")
public class StockAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_id", nullable = false)
    private Inventory inventory;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuditType auditType;

    @Column(nullable = false)
    private Integer systemQuantity;

    @Column(nullable = false)
    private Integer physicalQuantity;

    private Integer variance;

    @Enumerated(EnumType.STRING)
    private AuditStatus status = AuditStatus.PENDING;

    @Column(length = 500)
    private String remarks;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conducted_by")
    private User conductedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    private LocalDateTime auditDate;
    private LocalDateTime approvedAt;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public enum AuditType { SCHEDULED, SPOT_CHECK, CYCLE_COUNT, ANNUAL }
    public enum AuditStatus { PENDING, IN_PROGRESS, COMPLETED, APPROVED }

    public StockAudit() {}

    public StockAudit(Long id, Inventory inventory, AuditType auditType, Integer systemQuantity, Integer physicalQuantity, Integer variance, AuditStatus status, String remarks, User conductedBy, User approvedBy, LocalDateTime auditDate, LocalDateTime approvedAt, LocalDateTime createdAt) {
        this.id = id;
        this.inventory = inventory;
        this.auditType = auditType;
        this.systemQuantity = systemQuantity;
        this.physicalQuantity = physicalQuantity;
        this.variance = variance;
        if (status != null) this.status = status;
        this.remarks = remarks;
        this.conductedBy = conductedBy;
        this.approvedBy = approvedBy;
        this.auditDate = auditDate;
        this.approvedAt = approvedAt;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Inventory getInventory() { return inventory; }
    public void setInventory(Inventory inventory) { this.inventory = inventory; }
    public AuditType getAuditType() { return auditType; }
    public void setAuditType(AuditType auditType) { this.auditType = auditType; }
    public Integer getSystemQuantity() { return systemQuantity; }
    public void setSystemQuantity(Integer systemQuantity) { this.systemQuantity = systemQuantity; }
    public Integer getPhysicalQuantity() { return physicalQuantity; }
    public void setPhysicalQuantity(Integer physicalQuantity) { this.physicalQuantity = physicalQuantity; }
    public Integer getVariance() { return variance; }
    public void setVariance(Integer variance) { this.variance = variance; }
    public AuditStatus getStatus() { return status; }
    public void setStatus(AuditStatus status) { this.status = status; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public User getConductedBy() { return conductedBy; }
    public void setConductedBy(User conductedBy) { this.conductedBy = conductedBy; }
    public User getApprovedBy() { return approvedBy; }
    public void setApprovedBy(User approvedBy) { this.approvedBy = approvedBy; }
    public LocalDateTime getAuditDate() { return auditDate; }
    public void setAuditDate(LocalDateTime auditDate) { this.auditDate = auditDate; }
    public LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @PrePersist
    @PreUpdate
    public void calculateVariance() {
        if (physicalQuantity != null && systemQuantity != null) {
            this.variance = physicalQuantity - systemQuantity;
        }
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private Inventory inventory;
        private AuditType auditType;
        private Integer systemQuantity;
        private Integer physicalQuantity;
        private Integer variance;
        private AuditStatus status = AuditStatus.PENDING;
        private String remarks;
        private User conductedBy;
        private User approvedBy;
        private LocalDateTime auditDate;
        private LocalDateTime approvedAt;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder inventory(Inventory inventory) { this.inventory = inventory; return this; }
        public Builder auditType(AuditType auditType) { this.auditType = auditType; return this; }
        public Builder systemQuantity(Integer systemQuantity) { this.systemQuantity = systemQuantity; return this; }
        public Builder physicalQuantity(Integer physicalQuantity) { this.physicalQuantity = physicalQuantity; return this; }
        public Builder variance(Integer variance) { this.variance = variance; return this; }
        public Builder status(AuditStatus status) { this.status = status; return this; }
        public Builder remarks(String remarks) { this.remarks = remarks; return this; }
        public Builder conductedBy(User conductedBy) { this.conductedBy = conductedBy; return this; }
        public Builder approvedBy(User approvedBy) { this.approvedBy = approvedBy; return this; }
        public Builder auditDate(LocalDateTime auditDate) { this.auditDate = auditDate; return this; }
        public Builder approvedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public StockAudit build() {
            return new StockAudit(id, inventory, auditType, systemQuantity, physicalQuantity, variance, status, remarks, conductedBy, approvedBy, auditDate, approvedAt, createdAt);
        }
    }
}
