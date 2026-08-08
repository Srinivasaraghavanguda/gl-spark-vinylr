package com.gl.vinylr.catalog.controller;

import com.gl.vinylr.catalog.model.Album;
import com.gl.vinylr.catalog.repository.AlbumRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/catalog")
public class CatalogController {

    private final AlbumRepository albumRepository;

    public CatalogController(AlbumRepository albumRepository) {
    this.albumRepository = albumRepository;
}

    // ==========================
    // GET ALL ALBUMS
    // ==========================
    @GetMapping("/albums")
    public ResponseEntity<List<Album>> getAllAlbums() {
        return ResponseEntity.ok(albumRepository.findAll());
    }



    // ==========================
    // GET ALBUM BY ID
    // ==========================
    @GetMapping("/albums/{id}")
    public ResponseEntity<?> getAlbumById(@PathVariable Long id) {

        return albumRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(Map.of("message", "Album not found")));
    }

    // ==========================
    // SEARCH BY GENRE
    // ==========================
    @GetMapping("/albums/genre/{genre}")
    public ResponseEntity<List<Album>> getAlbumsByGenre(@PathVariable String genre) {
        return ResponseEntity.ok(albumRepository.findByGenreIgnoreCase(genre));
    }

    // ==========================
    // SEARCH BY TITLE
    // ==========================
    @GetMapping("/albums/search")
    public ResponseEntity<List<Album>> searchAlbums(
            @RequestParam String keyword) {

        return ResponseEntity.ok(
                albumRepository.findByTitleContainingIgnoreCase(keyword)
        );
    }

    // ==========================
    // ADD ALBUM (ADMIN)
    // ==========================
    @PostMapping("/albums")
    public ResponseEntity<Album> addAlbum(@RequestBody Album album) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(albumRepository.save(album));
    }
    // ==========================
// UPDATE ALBUM (ADMIN)
// ==========================
@PutMapping("/albums/{id}")
public ResponseEntity<?> updateAlbum(
        @PathVariable Long id,
        @RequestBody Album updatedAlbum) {

    return albumRepository.findById(id)
            .<ResponseEntity<?>>map(album -> {

                album.setTitle(updatedAlbum.getTitle());
                album.setArtist(updatedAlbum.getArtist());
                album.setGenre(updatedAlbum.getGenre());
                album.setDescription(updatedAlbum.getDescription());
                album.setImageUrl(updatedAlbum.getImageUrl());
                album.setReleaseYear(updatedAlbum.getReleaseYear());
                album.setPrice(updatedAlbum.getPrice());
                album.setStock(updatedAlbum.getStock());

                albumRepository.save(album);

                return ResponseEntity.ok(album);

            }).orElseGet(() ->
                    ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(Map.of(
                                    "message",
                                    "Album not found"
                            )));
}
// ==========================
// DELETE ALBUM (ADMIN)
// ==========================
@DeleteMapping("/albums/{id}")
public ResponseEntity<?> deleteAlbum(@PathVariable Long id) {

    if (!albumRepository.existsById(id)) {

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of(
                        "message",
                        "Album not found"
                ));
    }

    albumRepository.deleteById(id);

    return ResponseEntity.ok(
            Map.of(
                    "message",
                    "Album deleted successfully"
            ));
}

    // ==========================
    // RESERVE STOCK
    // ==========================
    @PostMapping("/albums/{id}/reserve")
    @Transactional
    public ResponseEntity<?> reserveAlbum(
            @PathVariable Long id,
            @RequestBody StockRequest request) {

        return updateStock(id, request.quantity(), false);
    }

    // ==========================
    // RELEASE STOCK
    // ==========================
    @PostMapping("/albums/{id}/release")
    @Transactional
    public ResponseEntity<?> releaseAlbum(
            @PathVariable Long id,
            @RequestBody StockRequest request) {

        return updateStock(id, request.quantity(), true);
    }

    // ==========================
    // COMMON STOCK METHOD
    // ==========================
    private ResponseEntity<?> updateStock(
            Long id,
            int quantity,
            boolean release) {

        if (quantity <= 0) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message",
                            "Quantity must be greater than zero"));
        }

        return albumRepository.findById(id)
                .<ResponseEntity<?>>map(album -> {

                    if (!release && album.getStock() < quantity) {
                        return ResponseEntity.status(HttpStatus.CONFLICT)
                                .body(Map.of("message",
                                        "Insufficient stock"));
                    }

                    if (release) {
                        album.setStock(album.getStock() + quantity);
                    } else {
                        album.setStock(album.getStock() - quantity);
                    }

                    albumRepository.save(album);

                    return ResponseEntity.ok(album);

                })
                .orElseGet(() ->
                        ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(Map.of("message",
                                        "Album not found")));
    }

    public record StockRequest(int quantity) {}
}