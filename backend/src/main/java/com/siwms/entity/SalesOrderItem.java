package com.siwms.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "sales_order_items")
public class SalesOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sales_order_id", nullable = false)
    private SalesOrder salesOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal unitPrice;

    @Column(precision = 5, scale = 2)
    private BigDecimal discountPercent = BigDecimal.ZERO;

    @Column(precision = 15, scale = 2)
    private BigDecimal lineTotal;

    public SalesOrderItem() {}

    public SalesOrderItem(Long id, SalesOrder salesOrder, Product product, Integer quantity, BigDecimal unitPrice, BigDecimal discountPercent, BigDecimal lineTotal) {
        this.id = id;
        this.salesOrder = salesOrder;
        this.product = product;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        if (discountPercent != null) this.discountPercent = discountPercent;
        this.lineTotal = lineTotal;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public SalesOrder getSalesOrder() { return salesOrder; }
    public void setSalesOrder(SalesOrder salesOrder) { this.salesOrder = salesOrder; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    public BigDecimal getDiscountPercent() { return discountPercent; }
    public void setDiscountPercent(BigDecimal discountPercent) { this.discountPercent = discountPercent; }
    public BigDecimal getLineTotal() { return lineTotal; }
    public void setLineTotal(BigDecimal lineTotal) { this.lineTotal = lineTotal; }

    @PrePersist
    @PreUpdate
    public void calculateLineTotal() {
        if (unitPrice != null && quantity != null) {
            BigDecimal gross = unitPrice.multiply(new BigDecimal(quantity));
            BigDecimal disc = discountPercent != null ? discountPercent : BigDecimal.ZERO;
            BigDecimal discount = gross.multiply(disc).divide(new BigDecimal("100"));
            this.lineTotal = gross.subtract(discount);
        }
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private SalesOrder salesOrder;
        private Product product;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal discountPercent = BigDecimal.ZERO;
        private BigDecimal lineTotal;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder salesOrder(SalesOrder salesOrder) { this.salesOrder = salesOrder; return this; }
        public Builder product(Product product) { this.product = product; return this; }
        public Builder quantity(Integer quantity) { this.quantity = quantity; return this; }
        public Builder unitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; return this; }
        public Builder discountPercent(BigDecimal discountPercent) { this.discountPercent = discountPercent; return this; }
        public Builder lineTotal(BigDecimal lineTotal) { this.lineTotal = lineTotal; return this; }

        public SalesOrderItem build() {
            return new SalesOrderItem(id, salesOrder, product, quantity, unitPrice, discountPercent, lineTotal);
        }
    }
}
