package com.gl.vinylr.catalog.controller;

import com.gl.vinylr.catalog.model.Album;
import com.gl.vinylr.catalog.repository.AlbumRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/catalog")
public class CatalogController {

    private final AlbumRepository albumRepository;

    public CatalogController(AlbumRepository albumRepository) {
        this.albumRepository = albumRepository;
    }

    @GetMapping("/albums")
    public List<Album> getAllAlbums() {
        return albumRepository.findAll();
    }

    @PostMapping("/albums")
    public ResponseEntity<Album> addAlbum(@RequestBody Album album) {
        Album savedAlbum = albumRepository.save(album);
        return ResponseEntity.ok(savedAlbum);
    }
}