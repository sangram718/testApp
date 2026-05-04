package com.app.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @GetMapping("/data")
    public ResponseEntity<Map<String, Object>> getDashboardData(Principal principal) {
        Map<String, Object> response = new HashMap<>();
        
        // Simulating fetching data for the logged-in user
        // You can change this to an empty list to test the "Data not found" state
        List<String> userActivities = new ArrayList<>();
        userActivities.add("Logged in successfully");
        userActivities.add("Viewed dashboard");
        
        // Uncomment the next line to simulate "Data not found"
        // userActivities.clear();

        response.put("userEmail", principal.getName());
        response.put("activities", userActivities);
        
        return ResponseEntity.ok(response);
    }
}
