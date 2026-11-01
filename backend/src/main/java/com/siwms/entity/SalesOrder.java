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
@Table(name = "sales_orders")
public class SalesOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String soNumber;

    @Column(nullable = false, length = 200)
    private String customerName;

    @Column(length = 150)
    private String customerEmail;

    @Column(length = 500)
    private String shippingAddress;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse sourceWarehouse;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SOStatus status = SOStatus.DRAFT;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus = PaymentStatus.UNPAID;

    private LocalDate orderDate;
    private LocalDate requiredDeliveryDate;
    private LocalDate shipDate;
    private LocalDate deliveredDate;

    @Column(precision = 15, scale = 2)
    private BigDecimal subtotal = BigDecimal.ZERO;

    @Column(precision = 5, scale = 2)
    private BigDecimal taxPercent = new BigDecimal("18.00");

    @Column(precision = 15, scale = 2)
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(precision = 15, scale = 2)
    private BigDecimal total = BigDecimal.ZERO;

    @Column(precision = 15, scale = 2)
    private BigDecimal paidAmount = BigDecimal.ZERO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sales_rep_id")
    private User salesRep;

    @OneToMany(mappedBy = "salesOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SalesOrderItem> items = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum SOStatus {
        DRAFT, CONFIRMED, PICKING, SHIPPED, DELIVERED, CANCELLED, RETURNED
    }

    public enum PaymentStatus {
        PAID, PARTIAL, UNPAID
    }

    public SalesOrder() {}

    public SalesOrder(Long id, String soNumber, String customerName, String customerEmail, String shippingAddress, Warehouse sourceWarehouse, SOStatus status, PaymentStatus paymentStatus, LocalDate orderDate, LocalDate requiredDeliveryDate, LocalDate shipDate, LocalDate deliveredDate, BigDecimal subtotal, BigDecimal taxPercent, BigDecimal taxAmount, BigDecimal total, BigDecimal paidAmount, User salesRep, List<SalesOrderItem> items, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.soNumber = soNumber;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.shippingAddress = shippingAddress;
        this.sourceWarehouse = sourceWarehouse;
        if (status != null) this.status = status;
        if (paymentStatus != null) this.paymentStatus = paymentStatus;
        this.orderDate = orderDate;
        this.requiredDeliveryDate = requiredDeliveryDate;
        this.shipDate = shipDate;
        this.deliveredDate = deliveredDate;
        if (subtotal != null) this.subtotal = subtotal;
        if (taxPercent != null) this.taxPercent = taxPercent;
        if (taxAmount != null) this.taxAmount = taxAmount;
        if (total != null) this.total = total;
        if (paidAmount != null) this.paidAmount = paidAmount;
        this.salesRep = salesRep;
        if (items != null) this.items = items;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSoNumber() { return soNumber; }
    public void setSoNumber(String soNumber) { this.soNumber = soNumber; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }
    public Warehouse getSourceWarehouse() { return sourceWarehouse; }
    public void setSourceWarehouse(Warehouse sourceWarehouse) { this.sourceWarehouse = sourceWarehouse; }
    public SOStatus getStatus() { return status; }
    public void setStatus(SOStatus status) { this.status = status; }
    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }
    public LocalDate getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDate orderDate) { this.orderDate = orderDate; }
    public LocalDate getRequiredDeliveryDate() { return requiredDeliveryDate; }
    public void setRequiredDeliveryDate(LocalDate requiredDeliveryDate) { this.requiredDeliveryDate = requiredDeliveryDate; }
    public LocalDate getShipDate() { return shipDate; }
    public void setShipDate(LocalDate shipDate) { this.shipDate = shipDate; }
    public LocalDate getDeliveredDate() { return deliveredDate; }
    public void setDeliveredDate(LocalDate deliveredDate) { this.deliveredDate = deliveredDate; }
    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    public BigDecimal getTaxPercent() { return taxPercent; }
    public void setTaxPercent(BigDecimal taxPercent) { this.taxPercent = taxPercent; }
    public BigDecimal getTaxAmount() { return taxAmount; }
    public void setTaxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; }
    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }
    public BigDecimal getPaidAmount() { return paidAmount; }
    public void setPaidAmount(BigDecimal paidAmount) { this.paidAmount = paidAmount; }
    public User getSalesRep() { return salesRep; }
    public void setSalesRep(User salesRep) { this.salesRep = salesRep; }
    public List<SalesOrderItem> getItems() { return items; }
    public void setItems(List<SalesOrderItem> items) { this.items = items; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String soNumber;
        private String customerName;
        private String customerEmail;
        private String shippingAddress;
        private Warehouse sourceWarehouse;
        private SOStatus status = SOStatus.DRAFT;
        private PaymentStatus paymentStatus = PaymentStatus.UNPAID;
        private LocalDate orderDate;
        private LocalDate requiredDeliveryDate;
        private LocalDate shipDate;
        private LocalDate deliveredDate;
        private BigDecimal subtotal = BigDecimal.ZERO;
        private BigDecimal taxPercent = new BigDecimal("18.00");
        private BigDecimal taxAmount = BigDecimal.ZERO;
        private BigDecimal total = BigDecimal.ZERO;
        private BigDecimal paidAmount = BigDecimal.ZERO;
        private User salesRep;
        private List<SalesOrderItem> items = new ArrayList<>();
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder soNumber(String soNumber) { this.soNumber = soNumber; return this; }
        public Builder customerName(String customerName) { this.customerName = customerName; return this; }
        public Builder customerEmail(String customerEmail) { this.customerEmail = customerEmail; return this; }
        public Builder shippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; return this; }
        public Builder sourceWarehouse(Warehouse sourceWarehouse) { this.sourceWarehouse = sourceWarehouse; return this; }
        public Builder status(SOStatus status) { this.status = status; return this; }
        public Builder paymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; return this; }
        public Builder orderDate(LocalDate orderDate) { this.orderDate = orderDate; return this; }
        public Builder requiredDeliveryDate(LocalDate requiredDeliveryDate) { this.requiredDeliveryDate = requiredDeliveryDate; return this; }
        public Builder shipDate(LocalDate shipDate) { this.shipDate = shipDate; return this; }
        public Builder deliveredDate(LocalDate deliveredDate) { this.deliveredDate = deliveredDate; return this; }
        public Builder subtotal(BigDecimal subtotal) { this.subtotal = subtotal; return this; }
        public Builder taxPercent(BigDecimal taxPercent) { this.taxPercent = taxPercent; return this; }
        public Builder taxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; return this; }
        public Builder total(BigDecimal total) { this.total = total; return this; }
        public Builder paidAmount(BigDecimal paidAmount) { this.paidAmount = paidAmount; return this; }
        public Builder salesRep(User salesRep) { this.salesRep = salesRep; return this; }
        public Builder items(List<SalesOrderItem> items) { this.items = items; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public SalesOrder build() {
            return new SalesOrder(id, soNumber, customerName, customerEmail, shippingAddress, sourceWarehouse, status, paymentStatus, orderDate, requiredDeliveryDate, shipDate, deliveredDate, subtotal, taxPercent, taxAmount, total, paidAmount, salesRep, items, createdAt, updatedAt);
        }
    }
}
