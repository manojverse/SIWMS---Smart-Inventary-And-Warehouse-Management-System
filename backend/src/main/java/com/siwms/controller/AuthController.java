package com.siwms.controller;

import com.siwms.dto.AuthDTO;
import com.siwms.entity.User;
import com.siwms.repository.UserRepository;
import com.siwms.security.JwtTokenProvider;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    public AuthController(AuthenticationManager authManager, JwtTokenProvider jwtTokenProvider, UserRepository userRepository) {
        this.authManager = authManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthDTO.LoginResponse> login(@Valid @RequestBody AuthDTO.LoginRequest request) {
        Authentication auth = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(auth);

        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        String accessToken = jwtTokenProvider.generateToken(auth);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());

        return ResponseEntity.ok(AuthDTO.LoginResponse.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .userId(user.getId())
            .name(user.getFullName())
            .email(user.getEmail())
            .role(user.getRole().name())
            .warehouseId(user.getWarehouse() != null ? user.getWarehouse().getId() : null)
            .warehouseName(user.getWarehouse() != null ? user.getWarehouse().getName() : null)
            .build());
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@Valid @RequestBody AuthDTO.RefreshRequest request) {
        if (!jwtTokenProvider.validateToken(request.getRefreshToken())) {
            return ResponseEntity.badRequest().body("Invalid refresh token");
        }
        String email = jwtTokenProvider.getEmailFromToken(request.getRefreshToken());
        String newAccessToken = jwtTokenProvider.generateRefreshToken(email);
        return ResponseEntity.ok(java.util.Map.of("accessToken", newAccessToken));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(java.util.Map.of("message", "Logged out successfully"));
    }
}
