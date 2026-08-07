package com.gl.vinylr.auth_service.service;

import com.gl.vinylr.auth_service.dto.AuthResponse;
import com.gl.vinylr.auth_service.dto.LoginRequest;
import com.gl.vinylr.auth_service.dto.RegisterRequest;
import com.gl.vinylr.auth_service.model.User;
import com.gl.vinylr.auth_service.repository.UserRepository;
import com.gl.vinylr.auth_service.util.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public ResponseEntity<?> register(RegisterRequest request) {

        String email = request.getEmail();

        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email is required"));
        }

        email = email.trim().toLowerCase();

        if (request.getPassword() == null ||
                request.getPassword().length() < 8) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Password must contain at least 8 characters"));
        }

        if (userRepository.existsByUsername(email)) {

            return ResponseEntity.status(HttpStatus.CONFLICT)

                    .body(Map.of(
                            "message",
                            "User already exists"));
        }

        User user = new User(

                email,

                passwordEncoder.encode(request.getPassword()),

                "ROLE_USER"
        );

        userRepository.save(user);

        return ResponseEntity.ok(

                Map.of(

                        "message",

                        "Registration Successful"

                )
        );
    }

    public ResponseEntity<?> login(LoginRequest request) {

        String email = request.getEmail();

        if (email == null || email.isBlank()) {

            return ResponseEntity.badRequest()

                    .body(Map.of(

                            "message",

                            "Email is required"));
        }

        email = email.trim().toLowerCase();

        Optional<User> userOptional =

                userRepository.findByUsername(email);

        if (userOptional.isEmpty()) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)

                    .body(Map.of(

                            "message",

                            "Invalid Email or Password"));
        }

        User user = userOptional.get();

        if (!passwordEncoder.matches(

                request.getPassword(),

                user.getPassword())) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)

                    .body(Map.of(

                            "message",

                            "Invalid Email or Password"));
        }

        String token =

                jwtUtil.generateToken(

                        user.getUsername(),

                        user.getRole());

        AuthResponse response =

                new AuthResponse(

                        token,

                        user.getUsername(),

                        user.getRole());

        return ResponseEntity.ok(response);

    }

}