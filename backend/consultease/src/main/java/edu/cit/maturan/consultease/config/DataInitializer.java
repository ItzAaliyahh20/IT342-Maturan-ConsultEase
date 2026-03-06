package edu.cit.maturan.consultease.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import edu.cit.maturan.consultease.entity.User;
import edu.cit.maturan.consultease.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create default admin user if not exists
        if (!userRepository.existsByEmail("admin@consultease.edu")) {
            User admin = User.builder()
                    .email("admin@consultease.edu")
                    .passwordHash(passwordEncoder.encode("Admin@123"))
                    .fullName("System Administrator")
                    .role(User.Role.ADMIN)
                    .provider("local")
                    .build();

            userRepository.save(admin);
            log.info("Default admin user created: admin@consultease.edu");
        }
    }
}
