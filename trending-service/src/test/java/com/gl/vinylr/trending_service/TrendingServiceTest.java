package com.gl.vinylr.trending_service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@AutoConfigureMockMvc
public class TrendingServiceTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testGetTrendingChart() throws Exception {
        mockMvc.perform(get("/api/trending/itunes-global"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$[0].title").exists());
    }

    @Test
    public void testGenreDistribution() throws Exception {
        mockMvc.perform(get("/api/trending/genres"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$[0].name").exists());
    }
}
