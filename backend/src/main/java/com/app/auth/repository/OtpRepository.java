package com.app.auth.repository;

import com.app.auth.entity.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OtpRepository extends JpaRepository<Otp, Long> {
    List<Otp> findByEmailAndUsedFalseOrderByExpirationTimeDesc(String email);
}
