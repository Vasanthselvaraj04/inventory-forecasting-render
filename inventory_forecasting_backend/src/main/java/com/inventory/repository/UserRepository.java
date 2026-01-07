package com.inventory.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.inventory.entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {

    @Query("SELECT u FROM User u WHERE u.username = :username AND u.password = :password")
    Optional<User> findByUsernameAndPassword(String username, String password);
    Optional<User> findByEmailId(String emailId);
    Optional<User> findByUsername(String username);
    

}
