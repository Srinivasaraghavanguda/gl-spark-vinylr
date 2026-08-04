package com.gl.vinylr.catalog.model;

import jakarta.persistence.*;

@Entity
@Table(name = "albums")
public class Album {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String artist;
    private String genre;
    private double price;
    private int stock;

    public Album() {}

    public Album(String title, String artist, String genre, double price, int stock) {
        this.title = title;
        this.artist = artist;
        this.genre = genre;
        this.price = price;
        this.stock = stock;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getArtist() { return artist; }
    public void setArtist(String artist) { this.artist = artist; }
    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }
}