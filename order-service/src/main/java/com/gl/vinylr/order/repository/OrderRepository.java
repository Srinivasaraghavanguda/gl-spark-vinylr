package com.gl.vinylr.order.repository;

import com.gl.vinylr.order.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUsername(String username);

    List<Order> findByStatusIgnoreCase(String status);

    List<Order> findByOrderReference(String orderReference);

}