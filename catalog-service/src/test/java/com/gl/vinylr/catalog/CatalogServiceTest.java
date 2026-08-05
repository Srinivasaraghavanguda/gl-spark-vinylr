package com.gl.vinylr.catalog;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class CatalogServiceTest {

    @Autowired
    private MockMvc mockMvc;

    // Test 1: Verify Album Catalog loads
    @Test
    public void testGetAllAlbums() throws Exception {
        mockMvc.perform(get("/api/catalog/albums"))
               .andExpect(status().isOk());
    }

    // Test 2: Verify Merch Catalog loads
    @Test
    public void testGetAllMerch() throws Exception {
        mockMvc.perform(get("/api/catalog/merch"))
               .andExpect(status().isOk());
    }
}