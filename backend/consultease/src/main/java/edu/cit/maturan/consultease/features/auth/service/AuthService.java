package edu.cit.maturan.consultease.features.auth.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import edu.cit.maturan.consultease.features.auth.dto.AuthResponse;
import edu.cit.maturan.consultease.features.auth.dto.LoginRequest;
import edu.cit.maturan.consultease.features.auth.dto.RegisterRequest;
import edu.cit.maturan.consultease.shared.dto.UserResponse;
import edu.cit.maturan.consultease.shared.entity.User;
import edu.cit.maturan.consultease.shared.security.JwtTokenProvider;
import edu.cit.maturan.consultease.shared.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    public AuthResponse login(LoginRequest request) {
        try {
            log.debug("Login attempt for email: {}", request.getEmail());
            
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String accessToken = jwtTokenProvider.generateToken(authentication);

            User user = userService.findByEmail(request.getEmail());
            UserResponse userResponse = userService.mapToUserResponse(user);

            log.info("Login successful for email: {}, role: {}", request.getEmail(), user.getRole());

            return AuthResponse.builder()
                    .accessToken(accessToken)
                    .tokenType("Bearer")
                    .expiresIn(jwtTokenProvider.getExpirationTime())
                    .user(userResponse)
                    .build();

        } catch (UsernameNotFoundException e) {
            log.warn("Login failed: User not found with email: {}", request.getEmail());
            throw new BadCredentialsException("Invalid email or password");
        } catch (BadCredentialsException e) {
            log.warn("Login failed: Invalid credentials for email: {}", request.getEmail());
            throw new BadCredentialsException("Invalid email or password");
        } catch (Exception e) {
            log.error("Login error for email: {}", request.getEmail(), e);
            throw new BadCredentialsException("Login failed. Please try again.");
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
