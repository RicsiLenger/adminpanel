package com.adminpanel.AdminPanel.Partners;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.adminpanel.AdminPanel.Users.User;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/partners")
public class PartnerController {
    @Autowired
    private PartnerRepository partnerRepostory;

    @GetMapping
    public List<Partner> getAllPartners(){
        return partnerRepostory.findAll();
    }

    @GetMapping("/{id}/users")
    public List<User> getUsersByPartnerId(@PathVariable Long id){
        return partnerRepostory.findUsersByPartnerId(id);
    }
}
