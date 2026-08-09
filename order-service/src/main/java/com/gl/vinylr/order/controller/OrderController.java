package com.gl.vinylr.order.controller;

import com.gl.vinylr.order.model.Order;
import com.gl.vinylr.order.repository.OrderRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepository;
    private final RestTemplate restTemplate;

    public OrderController(OrderRepository orderRepository,
                           RestTemplate restTemplate) {
        this.orderRepository = orderRepository;
        this.restTemplate = restTemplate;
    }

    // ==========================================
    // CREATE ORDER
    // ==========================================

    @PostMapping
    public ResponseEntity<Order> placeOrder(@RequestBody Order order) {

        order.setStatus("PENDING");

        Order savedOrder = orderRepository.save(order);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(savedOrder);
    }

    // ==========================================
    // GET ALL ORDERS (ADMIN)
    // ==========================================

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderRepository.findAll());
    }

    // ==========================================
    // GET USER ORDERS
    // ==========================================

    @GetMapping("/{username}")
    public ResponseEntity<List<Order>> getOrdersByUsername(
            @PathVariable String username) {

        return ResponseEntity.ok(
                orderRepository.findByUsername(username)
        );
    }

    // ==========================================
// UPDATE ORDER STATUS (ADMIN)
// ==========================================

@PutMapping("/{id}/status")
public ResponseEntity<?> updateOrderStatus(
        @PathVariable Long id,
        @RequestBody Map<String, String> request) {

    String status = request.get("status");

    if (status == null || status.isBlank()) {
        return ResponseEntity.badRequest()
                .body(Map.of("message", "Status is required"));
    }

    Order order = orderRepository.findById(id)
            .orElse(null);

    if (order == null) {
        return ResponseEntity.notFound().build();
    }

    String newStatus = status.trim().toUpperCase();

    order.setStatus(newStatus);

    if ("DELIVERED".equals(newStatus)) {
        order.setDeliveredOn(LocalDateTime.now());
    }

    Order updatedOrder = orderRepository.save(order);

    return ResponseEntity.ok(updatedOrder);
}

    // ==========================================
    // GET ORDERS BY STATUS
    // ==========================================

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                orderRepository.findByStatusIgnoreCase(status)
        );
    }

    // ==========================================
    // CHECKOUT
    // ==========================================

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(
            @RequestBody CheckoutRequest request) {

        if (request.customer() == null
                || isBlank(request.customer().email())
                || request.items() == null
                || request.items().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Customer email and at least one item are required"
                    ));
        }

        String orderReference =
                "VNLR-" +
                        UUID.randomUUID()
                                .toString()
                                .substring(0, 8)
                                .toUpperCase();

        List<CheckoutItem> reservedItems = new ArrayList<>();

        List<Order> orders = new ArrayList<>();

        try {

            for (CheckoutItem item : request.items()) {

                validateItem(item);

                Map<?, ?> catalogItem = reserve(item);

reservedItems.add(item);

Number price = (Number) catalogItem.get("price");

String productName;

if ("ALBUM".equalsIgnoreCase(item.productType())) {
    productName = String.valueOf(catalogItem.get("title"));
} else {
    productName = String.valueOf(catalogItem.get("name"));
}

                Order order = new Order();

                order.setUsername(
                        request.customer()
                                .email()
                                .trim()
                                .toLowerCase());

                order.setAlbumId(item.productId());

order.setProductName(productName);

order.setProductType(
        item.productType()
                .trim()
                .toUpperCase());

                order.setOrderReference(orderReference);

                order.setQuantity(item.quantity());

                order.setTotalPrice(
                        price.doubleValue() * item.quantity());

                order.setStatus("CONFIRMED");

order.setEstimatedDelivery(
        LocalDateTime.now().plusDays(4)
);

orders.add(order);
            }

            List<Order> savedOrders =
                    orderRepository.saveAll(orders);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(
                            Map.of(
                                    "orderReference",
                                    orderReference,
                                    "orders",
                                    savedOrders,
                                    "message",
                                    "Order placed successfully"
                            )
                    );

        } catch (HttpStatusCodeException exception) {

            releaseReservedItems(reservedItems);

            String message =
                    exception.getResponseBodyAsString().isBlank()
                            ? "Catalog reservation failed"
                            : exception.getResponseBodyAsString();

            return ResponseEntity
                    .status(exception.getStatusCode())
                    .body(Map.of("message", message));

        } catch (IllegalArgumentException exception) {

            releaseReservedItems(reservedItems);

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            exception.getMessage()
                    ));

        } catch (Exception exception) {

            releaseReservedItems(reservedItems);

            return ResponseEntity
                    .status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of(
                            "message",
                            "Checkout temporarily unavailable"
                    ));
        }
    }

    // ==========================================
    // RESERVE STOCK
    // ==========================================

    @SuppressWarnings("unchecked")
    private Map<?, ?> reserve(CheckoutItem item) {

        return restTemplate.postForObject(

                catalogUrl(item, "reserve"),

                Map.of(
                        "quantity",
                        item.quantity()
                ),

                Map.class
        );
    }

    // ==========================================
    // RELEASE STOCK
    // ==========================================

    private void releaseReservedItems(
            List<CheckoutItem> reservedItems) {

        for (CheckoutItem item : reservedItems) {

            try {

                restTemplate.postForObject(

                        catalogUrl(item, "release"),

                        Map.of(
                                "quantity",
                                item.quantity()
                        ),

                        Void.class);

            } catch (Exception ignored) {

            }

        }

    }

    // ==========================================
    // CATALOG URL
    // ==========================================

    private String catalogUrl(
            CheckoutItem item,
            String action) {

        String path =
                switch (item.productType()
                        .trim()
                        .toUpperCase()) {

                    case "ALBUM" -> "albums";

                    case "MERCH" -> "merch";

                    default ->
                            throw new IllegalArgumentException(
                                    "Product type must be ALBUM or MERCH");
                };

        return "http://localhost:8082/api/catalog/"
                + path
                + "/"
                + item.productId()
                + "/"
                + action;
    }

    // ==========================================
    // VALIDATION
    // ==========================================

    private void validateItem(CheckoutItem item) {

        if (item == null
                || item.productId() == null
                || item.productId() <= 0
                || item.quantity() <= 0
                || isBlank(item.productType())) {

            throw new IllegalArgumentException(
                    "Each item requires productId, productType and quantity");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    // ==========================================
    // DTOs
    // ==========================================

    public record CheckoutRequest(
            Customer customer,
            List<CheckoutItem> items,
            Double totalAmount,
            Double taxAmount,
            Double shippingAmount) {
    }

    public record Customer(
            String name,
            String email,
            String phone,
            String address) {
    }

    public record CheckoutItem(
            Long productId,
            String productType,
            int quantity) {
    }

}