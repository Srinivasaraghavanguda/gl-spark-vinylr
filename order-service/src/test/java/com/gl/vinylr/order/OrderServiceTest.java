package com.gl.vinylr.order;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class OrderServiceTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void contextLoads() {
    }

    // Test 2: Verifies order endpoint exists but correctly blocks GET requests
    @Test
    public void testGetOrdersEndpointIsProtected() throws Exception {
        mockMvc.perform(get("/api/orders"))
               .andExpect(status().isMethodNotAllowed()); // Expects the 405 block!
    }
}