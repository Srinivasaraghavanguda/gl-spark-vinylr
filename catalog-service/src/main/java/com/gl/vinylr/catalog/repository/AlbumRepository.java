package com.gl.vinylr.catalog.repository;

import com.gl.vinylr.catalog.model.Album;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlbumRepository extends JpaRepository<Album, Long> {

    List<Album> findByGenreIgnoreCase(String genre);

    List<Album> findByTitleContainingIgnoreCase(String keyword);

}