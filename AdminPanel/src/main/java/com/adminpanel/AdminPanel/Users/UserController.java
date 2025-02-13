package com.adminpanel.AdminPanel.Users;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/users")
public class UserController {
    
    @Autowired
    private UserRepository userRepository;

   @GetMapping
   public List<User> getAllUsers(){
    return userRepository.findAll();
   }
}
