package com.inventory.controller;

import org.springframework.web.bind.annotation.*;
import com.inventory.entity.User;
import com.inventory.service.UserService;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")

public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    @PostMapping("/login")
    public User login(@RequestBody User user) {
        return userService
                .login(user.getUsername(), user.getPassword())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));
    }
    
 // 🔹 FULL USER DETAILS (Your Account)
    @GetMapping("/{username}")
    public User getUserByUsername(@PathVariable String username) {
        return userService
                .getUserByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // 🔹 ALL USERS (Username + Role only)
    @GetMapping
    public List<Map<String, Object>> getAllUsers() {
        return userService.getAllUsers()
                .stream()
                .map(user -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("username", user.getUsername());
                    map.put("role", user.getRole());
                    return map;
                })
                .toList();
    }
    

}
