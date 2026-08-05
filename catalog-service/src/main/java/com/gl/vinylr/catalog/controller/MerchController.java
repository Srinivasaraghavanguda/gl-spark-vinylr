package com.gl.vinylr.catalog.controller;

import com.gl.vinylr.catalog.model.Merch;
import com.gl.vinylr.catalog.repository.MerchRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/catalog/merch")
public class MerchController {

    private final MerchRepository merchRepository;

    public MerchController(MerchRepository merchRepository) {
        this.merchRepository = merchRepository;
    }

    @GetMapping
    public List<Merch> getAllMerch() {
        return merchRepository.findAll();
    }

    @GetMapping("/category/{category}")
    public List<Merch> getMerchByCategory(@PathVariable String category) {
        return merchRepository.findByCategory(category);
    }
}