package com.gl.vinylr.trending_service;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/trending")
public class TrendingController {

    @GetMapping("/songs")
    public String getTrendingSongs() {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String itunesApiUrl = "https://itunes.apple.com/search?term=pop&limit=5&entity=song";
            return restTemplate.getForObject(itunesApiUrl, String.class);
        } catch (Exception e) {
            // Graceful fallback JSON
            return "{"
                + "\"status\": \"FALLBACK\","
                + "\"message\": \"Trending source currently unavailable.\","
                + "\"results\": ["
                + "  {\"trackName\": \"Bohemian Rhapsody\", \"artistName\": \"Queen\"},"
                + "  {\"trackName\": \"Hotel California\", \"artistName\": \"Eagles\"}"
                + "]"
                + "}";
        }
    }
}