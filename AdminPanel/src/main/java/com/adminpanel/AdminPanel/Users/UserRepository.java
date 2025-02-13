package com.adminpanel.AdminPanel.Users;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;



@Repository
public interface UserRepository extends JpaRepository<User, Long>{

    @Query(value = "SELECT u FROM User u LEFT JOIN u.connects c WHERE c.partner.id = :partnerId", nativeQuery = true)
    List<User> findUsersByPartnerId(Long partnerId);

}
