package com.inventory.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.inventory.entity.User;
import com.inventory.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ✅ REGISTER → DB SAVE
    @Override
    public User saveUser(User user) {
        System.out.println("REGISTER USER:");
        System.out.println("Username = " + user.getUsername());
        System.out.println("Email = " + user.getEmailId());
        System.out.println("Password = " + user.getPassword());
        System.out.println("Role = " + user.getRole());

        return userRepository.save(user); // 🔥 DB happens here
    }

    // ✅ LOGIN → DB FETCH
    @Override
    public Optional<User> login(String username, String password) {
        return userRepository.findByUsernameAndPassword(username, password);
        // 🔥 DB happens here
    }
    
 // 🔹 FULL USER DETAILS
    @Override
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // 🔹 ALL USERS
    @Override
    public java.util.List<User> getAllUsers() {
        return userRepository.findAll();
    }
 

}
