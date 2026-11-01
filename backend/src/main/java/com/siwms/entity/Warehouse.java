package com.siwms.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "warehouses")
public class Warehouse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 255)
    private String address;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(nullable = false, length = 10)
    private String pincode;

    private Double capacitySqft;

    private Double usedCapacitySqft;

    @Enumerated(EnumType.STRING)
    private TemperatureType temperatureType = TemperatureType.AMBIENT;

    @Column(nullable = false)
    private boolean active = true;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public enum TemperatureType {
        AMBIENT, COLD_CHAIN, DEEP_FREEZE, MIXED
    }

    public Warehouse() {}

    public Warehouse(Long id, String code, String name, String address, String city, String state, String pincode, Double capacitySqft, Double usedCapacitySqft, TemperatureType temperatureType, boolean active, LocalDateTime createdAt) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.address = address;
        this.city = city;
        this.state = state;
        this.pincode = pincode;
        this.capacitySqft = capacitySqft;
        this.usedCapacitySqft = usedCapacitySqft;
        if (temperatureType != null) this.temperatureType = temperatureType;
        this.active = active;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }
    public Double getCapacitySqft() { return capacitySqft; }
    public void setCapacitySqft(Double capacitySqft) { this.capacitySqft = capacitySqft; }
    public Double getUsedCapacitySqft() { return usedCapacitySqft; }
    public void setUsedCapacitySqft(Double usedCapacitySqft) { this.usedCapacitySqft = usedCapacitySqft; }
    public TemperatureType getTemperatureType() { return temperatureType; }
    public void setTemperatureType(TemperatureType temperatureType) { this.temperatureType = temperatureType; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public double getUtilizationPercent() {
        if (capacitySqft == null || capacitySqft == 0) return 0;
        if (usedCapacitySqft == null) return 0;
        return (usedCapacitySqft / capacitySqft) * 100;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String code;
        private String name;
        private String address;
        private String city;
        private String state;
        private String pincode;
        private Double capacitySqft;
        private Double usedCapacitySqft;
        private TemperatureType temperatureType = TemperatureType.AMBIENT;
        private boolean active = true;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder code(String code) { this.code = code; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder address(String address) { this.address = address; return this; }
        public Builder city(String city) { this.city = city; return this; }
        public Builder state(String state) { this.state = state; return this; }
        public Builder pincode(String pincode) { this.pincode = pincode; return this; }
        public Builder capacitySqft(Double capacitySqft) { this.capacitySqft = capacitySqft; return this; }
        public Builder usedCapacitySqft(Double usedCapacitySqft) { this.usedCapacitySqft = usedCapacitySqft; return this; }
        public Builder temperatureType(TemperatureType temperatureType) { this.temperatureType = temperatureType; return this; }
        public Builder active(boolean active) { this.active = active; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Warehouse build() {
            return new Warehouse(id, code, name, address, city, state, pincode, capacitySqft, usedCapacitySqft, temperatureType, active, createdAt);
        }
    }
}
