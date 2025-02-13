package com.adminpanel.AdminPanel.Partners;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.adminpanel.AdminPanel.Users.User;

import java.util.List;

@Repository
public interface PartnerRepository extends JpaRepository<Partner, Long>{

    @Query("SELECT u FROM User u JOIN Connect c ON u.id = c.id.userId WHERE c.id.partnerId = ?1")
    List<User> findUsersByPartnerId(Long partnerId);

}
