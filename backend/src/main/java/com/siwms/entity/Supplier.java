package com.siwms.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "suppliers")
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 100)
    private String contactPerson;

    @Column(unique = true, length = 150)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(length = 255)
    private String address;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String country;

    private Integer paymentTermsDays = 30;

    @Column(precision = 3, scale = 1)
    private BigDecimal rating = BigDecimal.ZERO;

    private Integer totalOrders = 0;

    private Integer onTimeDeliveryPercent = 0;

    @Column(precision = 15, scale = 2)
    private BigDecimal outstandingBalance = BigDecimal.ZERO;

    @Column(nullable = false)
    private boolean active = true;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public Supplier() {}

    public Supplier(Long id, String code, String name, String contactPerson, String email, String phone, String address, String city, String country, Integer paymentTermsDays, BigDecimal rating, Integer totalOrders, Integer onTimeDeliveryPercent, BigDecimal outstandingBalance, boolean active, LocalDateTime createdAt) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.contactPerson = contactPerson;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.city = city;
        this.country = country;
        if (paymentTermsDays != null) this.paymentTermsDays = paymentTermsDays;
        if (rating != null) this.rating = rating;
        if (totalOrders != null) this.totalOrders = totalOrders;
        if (onTimeDeliveryPercent != null) this.onTimeDeliveryPercent = onTimeDeliveryPercent;
        if (outstandingBalance != null) this.outstandingBalance = outstandingBalance;
        this.active = active;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getContactPerson() { return contactPerson; }
    public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public Integer getPaymentTermsDays() { return paymentTermsDays; }
    public void setPaymentTermsDays(Integer paymentTermsDays) { this.paymentTermsDays = paymentTermsDays; }
    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }
    public Integer getTotalOrders() { return totalOrders; }
    public void setTotalOrders(Integer totalOrders) { this.totalOrders = totalOrders; }
    public Integer getOnTimeDeliveryPercent() { return onTimeDeliveryPercent; }
    public void setOnTimeDeliveryPercent(Integer onTimeDeliveryPercent) { this.onTimeDeliveryPercent = onTimeDeliveryPercent; }
    public BigDecimal getOutstandingBalance() { return outstandingBalance; }
    public void setOutstandingBalance(BigDecimal outstandingBalance) { this.outstandingBalance = outstandingBalance; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String code;
        private String name;
        private String contactPerson;
        private String email;
        private String phone;
        private String address;
        private String city;
        private String country;
        private Integer paymentTermsDays = 30;
        private BigDecimal rating = BigDecimal.ZERO;
        private Integer totalOrders = 0;
        private Integer onTimeDeliveryPercent = 0;
        private BigDecimal outstandingBalance = BigDecimal.ZERO;
        private boolean active = true;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder code(String code) { this.code = code; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder contactPerson(String contactPerson) { this.contactPerson = contactPerson; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder phone(String phone) { this.phone = phone; return this; }
        public Builder address(String address) { this.address = address; return this; }
        public Builder city(String city) { this.city = city; return this; }
        public Builder country(String country) { this.country = country; return this; }
        public Builder paymentTermsDays(Integer paymentTermsDays) { this.paymentTermsDays = paymentTermsDays; return this; }
        public Builder rating(BigDecimal rating) { this.rating = rating; return this; }
        public Builder totalOrders(Integer totalOrders) { this.totalOrders = totalOrders; return this; }
        public Builder onTimeDeliveryPercent(Integer onTimeDeliveryPercent) { this.onTimeDeliveryPercent = onTimeDeliveryPercent; return this; }
        public Builder outstandingBalance(BigDecimal outstandingBalance) { this.outstandingBalance = outstandingBalance; return this; }
        public Builder active(boolean active) { this.active = active; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Supplier build() {
            return new Supplier(id, code, name, contactPerson, email, phone, address, city, country, paymentTermsDays, rating, totalOrders, onTimeDeliveryPercent, outstandingBalance, active, createdAt);
        }
    }
}
