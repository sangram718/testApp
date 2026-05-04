package com.app.auth.service;

import com.app.auth.dto.*;
import com.app.auth.entity.User;
import com.app.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final OtpService otpService;
    private final EmailService emailService;

    public MessageResponse register(RegisterRequest request) {
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent() && existingUser.get().isVerified()) {
            throw new RuntimeException("Email already in use");
        }

        User user = existingUser.orElse(new User());
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setVerified(false);
        userRepository.save(user);

        String otp = otpService.generateOtp(user.getEmail());
        
        // Send real email
        emailService.sendOtpEmail(user.getEmail(), otp);

        return MessageResponse.builder().message("Registration successful. OTP sent to email.").build();
    }

    public MessageResponse verifyOtp(VerifyOtpRequest request) {
        boolean isValid = otpService.verifyOtp(request.getEmail(), request.getOtp());
        
        if (!isValid) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        user.setVerified(true);
        userRepository.save(user);

        return MessageResponse.builder().message("Account verified successfully").build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isVerified()) {
            throw new RuntimeException("Account not verified. Please verify your email first.");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        String jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder().token(jwtToken).message("Login successful").build();
    }

    public MessageResponse forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String otp = otpService.generateOtp(user.getEmail());

        // Send real email
        emailService.sendOtpEmail(user.getEmail(), otp);

        return MessageResponse.builder().message("OTP sent to email for password reset.").build();
    }

    public MessageResponse resetPassword(ResetPasswordRequest request) {
        boolean isValid = otpService.verifyOtp(request.getEmail(), request.getOtp());

        if (!isValid) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return MessageResponse.builder().message("Password reset successfully").build();
    }
}
