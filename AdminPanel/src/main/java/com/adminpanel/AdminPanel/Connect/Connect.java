package com.adminpanel.AdminPanel.Connect;

import java.util.Objects;

import com.adminpanel.AdminPanel.Partners.Partner;
import com.adminpanel.AdminPanel.Users.User;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;

@Entity
@Table(name = "connect")
public class Connect {

    @EmbeddedId
    private ConnectId id;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("partnerId")
    @JoinColumn(name = "partner_id")
    private Partner partner;


    public ConnectId getId() {
        return id;
    }

    public void setId(ConnectId id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Partner getPartner() {
        return partner;
    }

    public void setPartner(Partner partner) {
        this.partner = partner;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Connect connect = (Connect) o;
        return Objects.equals(user, connect.user) &&
               Objects.equals(partner, connect.partner);
    }

    @Override
    public int hashCode() {
        return Objects.hash(user, partner);
    }
}

