package com.gl.vinylr.trending_service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/api/trending")
public class TrendingController {

    // ==========================
    // GLOBAL iTUNES CHARTS
    // ==========================
   @GetMapping("/itunes-global")
public ResponseEntity<List<Map<String, Object>>> getItunesCharts() {

    try {

        RestTemplate restTemplate = new RestTemplate();

        String url = "https://itunes.apple.com/us/rss/topsongs/limit=20/json";

        String json = restTemplate.getForObject(url, String.class);

        ObjectMapper mapper = new ObjectMapper();

        JsonNode root = mapper.readTree(json);

        JsonNode entries = root.path("feed").path("entry");

        List<Map<String, Object>> tracks = new ArrayList<>();

        int rank = 1;

        if (entries.isArray()) {

            for (JsonNode e : entries) {

                Map<String, Object> track = new HashMap<>();

                // ==========================
                // GET HIGHEST QUALITY COVER
                // ==========================
                String cover = "";

                JsonNode images = e.path("im:image");

                if (images.isArray() && images.size() > 0) {
                    cover = images
                            .get(images.size() - 1)
                            .path("label")
                            .asText("");
                }

                // ==========================
                // BUILD RESPONSE
                // ==========================
                track.put("id", rank);
                track.put("rank", rank);

                track.put(
                        "title",
                        e.path("im:name")
                                .path("label")
                                .asText("")
                );

                track.put(
                        "artist",
                        e.path("im:artist")
                                .path("label")
                                .asText("")
                );

                track.put("cover", cover);

                // RSS feed doesn't provide these
                track.put("streams", "--");
                track.put("duration", "--:--");

                tracks.add(track);

                rank++;
            }
        }

        return ResponseEntity.ok(tracks);

    } catch (Exception ex) {

        ex.printStackTrace();

        return ResponseEntity.ok(Arrays.asList(

                Map.of(
                        "id", 1,
                        "rank", 1,
                        "title", "Midnight Drive LP",
                        "artist", "The Synthetics",
                        "cover", "",
                        "streams", "95.5M",
                        "duration", "03:18"
                ),

                Map.of(
                        "id", 2,
                        "rank", 2,
                        "title", "Analog Echoes",
                        "artist", "VinylR Originals",
                        "cover", "",
                        "streams", "89.2M",
                        "duration", "03:05"
                ),

                Map.of(
                        "id", 3,
                        "rank", 3,
                        "title", "Neon Pulse Boxset",
                        "artist", "Cosmic Wave",
                        "cover", "",
                        "streams", "81.4M",
                        "duration", "03:42"
                )

        ));
    }
}

    // ==========================
    // VINYLR BEST SELLERS
    // ==========================
    @GetMapping("/vinylr-top")
    public ResponseEntity<List<Map<String,Object>>> vinylrTop(){

        return ResponseEntity.ok(Arrays.asList(

                Map.of(
                        "id",1,
                        "rank",1,
                        "title","Midnight Drive LP",
                        "artist","The Synthetics",
                        "sales","12,450"
                ),

                Map.of(
                        "id",2,
                        "rank",2,
                        "title","Neon Pulse Boxset",
                        "artist","Cosmic Wave",
                        "sales","9,820"
                ),

                Map.of(
                        "id",3,
                        "rank",3,
                        "title","Analog Echoes",
                        "artist","VinylR Originals",
                        "sales","8,910"
                )

        ));

    }

    // ==========================
    // FEATURED ALBUMS
    // ==========================
    @GetMapping("/featured")
    public ResponseEntity<List<Map<String,Object>>> featuredAlbums(){

        return ResponseEntity.ok(Arrays.asList(

                Map.of(
                        "title","Midnight Drive LP",
                        "artist","The Synthetics",
                        "image","",
                        "tag","BEST SELLER"
                ),

                Map.of(
                        "title","Neon Pulse Boxset",
                        "artist","Cosmic Wave",
                        "image","",
                        "tag","LIMITED"
                ),

                Map.of(
                        "title","Analog Echoes",
                        "artist","VinylR Originals",
                        "image","",
                        "tag","NEW"
                )

        ));

    }

    // ==========================
    // UPCOMING CONCERTS
    // ==========================
    @GetMapping("/concerts")
    public ResponseEntity<List<Map<String,Object>>> concerts(){

        return ResponseEntity.ok(Arrays.asList(

                Map.of(
                        "id",1,
                        "artist","Aurora Sky",
                        "venue","Hyderabad",
                        "date","12 Nov 2026",
                        "banner","",
                        "status","Upcoming"
                ),

                Map.of(
                        "id",2,
                        "artist","Cosmic Wave",
                        "venue","Bengaluru",
                        "date","24 Dec 2026",
                        "banner","",
                        "status","Tickets Available"
                ),

                Map.of(
                        "id",3,
                        "artist","Nova Pulse",
                        "venue","Mumbai",
                        "date","18 Jan 2027",
                        "banner","",
                        "status","Limited Seats"
                )

        ));

    }

    // ==========================
    // MUSIC GENRES
    // ==========================
    @GetMapping("/genres")
    public ResponseEntity<List<Map<String,Object>>> genres(){

        return ResponseEntity.ok(Arrays.asList(

                Map.of(
                        "name","Rock",
                        "percentage",30,
                        "color","#E53935"
                ),

                Map.of(
                        "name","Electronic",
                        "percentage",25,
                        "color","#7E57C2"
                ),

                Map.of(
                        "name","Pop",
                        "percentage",20,
                        "color","#EF5350"
                ),

                Map.of(
                        "name","Hip Hop",
                        "percentage",15,
                        "color","#42A5F5"
                ),

                Map.of(
                        "name","Classical",
                        "percentage",10,
                        "color","#FFB300"
                )

        ));

    }

}