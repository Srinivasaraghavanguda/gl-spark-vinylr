package com.gl.vinylr.trendingservice;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/trending")
public class TrendingController {

    @GetMapping("/songs")
    public String getTrendingSongs() {
        // We are using Spring's RestTemplate to call a public iTunes API
        RestTemplate restTemplate = new RestTemplate();
        String itunesApiUrl = "https://itunes.apple.com/search?term=pop&limit=5&entity=song";
        
        // Fetch the data and return it directly to the user
        return restTemplate.getForObject(itunesApiUrl, String.class);
    }
}