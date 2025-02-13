package com.adminpanel.AdminPanel.Connect;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Embeddable;

@Embeddable
public class ConnectId implements Serializable {

    private Long userId;
    private Long partnerId;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getPartnerId() {
        return partnerId;
    }

    public void setPartnerId(Long partnerId) {
        this.partnerId = partnerId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ConnectId connectId = (ConnectId) o;
        return Objects.equals(userId, connectId.userId) &&
               Objects.equals(partnerId, connectId.partnerId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, partnerId);
    }

}
