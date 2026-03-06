package edu.cit.maturan.consultease.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import edu.cit.maturan.consultease.dto.AuthResponse;
import edu.cit.maturan.consultease.dto.LoginRequest;
import edu.cit.maturan.consultease.dto.RegisterRequest;
import edu.cit.maturan.consultease.dto.UserResponse;
import edu.cit.maturan.consultease.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    public AuthResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String accessToken = jwtTokenProvider.generateToken(authentication);

            UserResponse userResponse = userService.mapToUserResponse(
                    userService.findByEmail(request.getEmail())
            );

            return AuthResponse.builder()
                    .accessToken(accessToken)
                    .tokenType("Bearer")
                    .expiresIn(jwtTokenProvider.getExpirationTime())
                    .user(userResponse)
                    .build();

        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid email or password");
        }
    }

    public AuthResponse register(RegisterRequest request) {
        // Register as student only through public endpoint
        UserResponse userResponse = userService.registerStudent(request);

        // Auto-login after registration
        LoginRequest loginRequest = LoginRequest.builder()
                .email(request.getEmail())
                .password(request.getPassword())
                .build();

        return login(loginRequest);
    }

    public void logout() {
        SecurityContextHolder.clearContext();
    }
}
