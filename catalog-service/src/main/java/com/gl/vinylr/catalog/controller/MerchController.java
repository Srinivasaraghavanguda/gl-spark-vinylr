package com.gl.vinylr.catalog.controller;

import com.gl.vinylr.catalog.model.Merch;
import com.gl.vinylr.catalog.repository.MerchRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/catalog/merch")
@CrossOrigin(origins = "*")
public class MerchController {

    private final MerchRepository merchRepository;

    public MerchController(MerchRepository merchRepository) {
        this.merchRepository = merchRepository;
    }

    // ==========================
    // GET ALL MERCH
    // ==========================
    @GetMapping
    public ResponseEntity<List<Merch>> getAllMerch() {
        return ResponseEntity.ok(merchRepository.findAll());
    }

    // ==========================
    // GET MERCH BY ID
    // ==========================
    @GetMapping("/{id}")
    public ResponseEntity<?> getMerchById(@PathVariable Long id) {

        return merchRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(Map.of("message", "Merch not found")));
    }

    // ==========================
    // GET BY CATEGORY
    // ==========================
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Merch>> getMerchByCategory(
            @PathVariable String category) {

        return ResponseEntity.ok(
                merchRepository.findByCategoryIgnoreCase(category)
        );
    }

    // ==========================
    // SEARCH BY NAME
    // ==========================
    @GetMapping("/search")
    public ResponseEntity<List<Merch>> searchMerch(
            @RequestParam String keyword) {

        return ResponseEntity.ok(
                merchRepository.findByNameContainingIgnoreCase(keyword)
        );
    }

    // ==========================
    // RESERVE STOCK
    // ==========================
    @PostMapping("/{id}/reserve")
    @Transactional
    public ResponseEntity<?> reserveMerch(
            @PathVariable Long id,
            @RequestBody CatalogController.StockRequest request) {

        return updateStock(id, request.quantity(), false);
    }

    // ==========================
    // RELEASE STOCK
    // ==========================
    @PostMapping("/{id}/release")
    @Transactional
    public ResponseEntity<?> releaseMerch(
            @PathVariable Long id,
            @RequestBody CatalogController.StockRequest request) {

        return updateStock(id, request.quantity(), true);
    }

    private ResponseEntity<?> updateStock(
            Long id,
            int quantity,
            boolean release) {

        if (quantity <= 0) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message",
                            "Quantity must be greater than zero"));
        }

        return merchRepository.findById(id)
                .<ResponseEntity<?>>map(merch -> {

                    if (!release && merch.getStock() < quantity) {
                        return ResponseEntity.status(HttpStatus.CONFLICT)
                                .body(Map.of("message",
                                        "Insufficient stock"));
                    }

                    if (release) {
                        merch.setStock(merch.getStock() + quantity);
                    } else {
                        merch.setStock(merch.getStock() - quantity);
                    }

                    merchRepository.save(merch);

                    return ResponseEntity.ok(merch);

                })
                .orElseGet(() ->
                        ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(Map.of("message",
                                        "Merch not found")));
    }
}