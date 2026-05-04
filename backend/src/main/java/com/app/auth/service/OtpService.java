package com.app.auth.service;

import com.app.auth.entity.Otp;
import com.app.auth.repository.OtpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpRepository otpRepository;

    public String generateOtp(String email) {
        String otpCode = String.format("%06d", new Random().nextInt(999999));
        
        Otp otp = Otp.builder()
                .email(email)
                .otpCode(otpCode)
                .expirationTime(LocalDateTime.now().plusMinutes(5)) // OTP valid for 5 minutes
                .used(false)
                .build();
                
        otpRepository.save(otp);
        return otpCode;
    }

    public boolean verifyOtp(String email, String otpCode) {
        List<Otp> otps = otpRepository.findByEmailAndUsedFalseOrderByExpirationTimeDesc(email);
        
        if (otps.isEmpty()) {
            return false;
        }

        Otp latestOtp = otps.get(0);
        
        if (latestOtp.getOtpCode().equals(otpCode) && latestOtp.getExpirationTime().isAfter(LocalDateTime.now())) {
            latestOtp.setUsed(true);
            otpRepository.save(latestOtp);
            return true;
        }
        
        return false;
    }
}
