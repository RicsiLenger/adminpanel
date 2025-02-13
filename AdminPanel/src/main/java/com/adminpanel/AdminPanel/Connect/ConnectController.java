package com.adminpanel.AdminPanel.Connect;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/connect")
public class ConnectController {

    @Autowired
    private ConnectRepository connectRepository;

    @GetMapping
    public List<Connect> getAllConnections() {
        return connectRepository.findAll();
    }
}
