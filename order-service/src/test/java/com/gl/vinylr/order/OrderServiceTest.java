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
    void contextLoads() {
    }

    // Verify GET /api/orders returns 200 OK
    @Test
    void testGetAllOrders() throws Exception {

        mockMvc.perform(get("/api/orders"))
                .andExpect(status().isOk());

    }

    // Verify GET /api/orders/status/{status}
    @Test
    void testGetOrdersByStatus() throws Exception {

        mockMvc.perform(get("/api/orders/status/CONFIRMED"))
                .andExpect(status().isOk());

    }

}