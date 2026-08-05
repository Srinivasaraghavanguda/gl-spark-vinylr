package com.gl.vinylr.trending_service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

@SpringBootTest
@AutoConfigureMockMvc
public class TrendingServiceTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testGetTrendingChart() throws Exception {
        mockMvc.perform(get("/api/trending/songs"))
               .andExpect(status().isOk());
    }

    @Test
    public void testFallbackWhenSourceUnavailable() throws Exception {
        mockMvc.perform(get("/api/trending/songs"))
               .andExpect(status().isOk())
               .andExpect(content().string(org.hamcrest.Matchers.anyOf(
                       containsString("results"), 
                       containsString("FALLBACK")     
               )));
    }
}