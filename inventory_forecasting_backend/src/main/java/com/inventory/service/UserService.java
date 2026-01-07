package com.inventory.service;

import java.util.Optional;
import com.inventory.entity.User;

public interface UserService {

    // REGISTER
    User saveUser(User user);

    // LOGIN
    Optional<User> login(String username, String password);
    Optional<User> getUserByUsername(String username);
    java.util.List<User> getAllUsers();

}
