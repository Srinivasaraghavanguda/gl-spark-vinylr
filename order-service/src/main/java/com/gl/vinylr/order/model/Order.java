package com.gl.vinylr.order.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "customer_orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private Long albumId;

    @Column(nullable = false)
private String productName;

    @Column(nullable = false)
    private String productType;

    @Column(nullable = false)
    private String orderReference;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Double totalPrice;

    @Column(nullable = false)
    private String status;

    private LocalDateTime orderDate;

private LocalDateTime estimatedDelivery;

private LocalDateTime deliveredOn;

    public Order() {
        this.orderDate = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Long getAlbumId() {
    return albumId;
}

public void setAlbumId(Long albumId) {
    this.albumId = albumId;
}

public String getProductName() {
    return productName;
}

public void setProductName(String productName) {
    this.productName = productName;
}

public String getProductType() {
    return productType;
}
    public void setProductType(String productType) {
        this.productType = productType;
    }

    public String getOrderReference() {
        return orderReference;
    }

    public void setOrderReference(String orderReference) {
        this.orderReference = orderReference;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public LocalDateTime getEstimatedDelivery() {
    return estimatedDelivery;
}

public void setEstimatedDelivery(LocalDateTime estimatedDelivery) {
    this.estimatedDelivery = estimatedDelivery;
}

public LocalDateTime getDeliveredOn() {
    return deliveredOn;
}

public void setDeliveredOn(LocalDateTime deliveredOn) {
    this.deliveredOn = deliveredOn;
}
}