package com.gl.vinylr.catalog.repository;

import com.gl.vinylr.catalog.model.Merch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MerchRepository extends JpaRepository<Merch, Long> {

    List<Merch> findByCategoryIgnoreCase(String category);

    List<Merch> findByNameContainingIgnoreCase(String keyword);

}