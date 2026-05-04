package com.app.auth.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendOtpEmail(String to, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("Your Verification Code");
            
            String htmlContent = """
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px;">
                    <h2 style="color: #4f46e5; text-align: center;">Authentication System</h2>
                    <p style="color: #334155; font-size: 16px;">Hello,</p>
                    <p style="color: #334155; font-size: 16px;">Your verification code is:</p>
                    <div style="background-color: #f1f5f9; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
                        <h1 style="color: #0f172a; letter-spacing: 5px; margin: 0;">%s</h1>
                    </div>
                    <p style="color: #64748b; font-size: 14px;">This code will expire in 5 minutes.</p>
                    <p style="color: #64748b; font-size: 14px; margin-top: 30px;">If you didn't request this code, please ignore this email.</p>
                </div>
                """.formatted(otp);
                
            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
}
