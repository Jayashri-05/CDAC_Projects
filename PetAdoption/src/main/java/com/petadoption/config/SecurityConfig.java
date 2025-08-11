package com.petadoption.config;

import com.petadoption.security.CustomUserDetailsService;
import com.petadoption.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        System.out.println("[DEBUG] Configuring Security Filter Chain");
        http
                .cors(Customizer.withDefaults()) // ✅ Enable CORS
                .csrf(csrf -> csrf
                        .ignoringRequestMatchers(new AntPathRequestMatcher("/h2-console/**"))
                        .disable()) // ✅ Disable CSRF for APIs and H2
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(new AntPathRequestMatcher("/api/auth/**")).permitAll() // ✅ Allow /register, /login, /forgot-password
                        .requestMatchers(new AntPathRequestMatcher("/uploads/**")).permitAll() // ✅ Allow access to uploaded files
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/pets/**").permitAll() // ✅ Allow GET for pets
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/pets/**").authenticated() // ✅ Require auth for POST
                        .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/pets/**").authenticated() // ✅ Require auth for PUT
                        .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/pets/**").authenticated() // ✅ Require auth for DELETE
                        .requestMatchers(new AntPathRequestMatcher("/api/users/**")).permitAll() // ✅ Temporarily allow users endpoint
                        .requestMatchers(new AntPathRequestMatcher("/api/announcements/**")).permitAll() // ✅ Temporarily allow announcements endpoint
                        .requestMatchers(new AntPathRequestMatcher("/api/contact/submit")).permitAll() // ✅ Allow contact form submission
                        .requestMatchers(new AntPathRequestMatcher("/api/contact/messages/**")).authenticated() // ✅ Allow authenticated access to contact messages (admin)
                        .requestMatchers(new AntPathRequestMatcher("/api/shelters/**")).permitAll() // ✅ Allow access to shelters
                        .requestMatchers(new AntPathRequestMatcher("/api/blogs/all")).permitAll() // ✅ Allow reading all blogs
                        .requestMatchers(new AntPathRequestMatcher("/api/blogs/test")).permitAll() // ✅ Allow test endpoint
                        .requestMatchers(new AntPathRequestMatcher("/api/blogs/test-image")).permitAll() // ✅ Allow test image endpoint
                        .requestMatchers(new AntPathRequestMatcher("/api/blogs/image/**")).permitAll() // ✅ Allow image serving
                        .requestMatchers(new AntPathRequestMatcher("/api/blogs/user/**")).permitAll() // ✅ Allow reading user blogs
                        .requestMatchers(new AntPathRequestMatcher("/api/blogs/create/**")).authenticated() // ✅ Require auth for blog creation
                        .requestMatchers(new AntPathRequestMatcher("/api/blogs/**")).authenticated() // ✅ Require auth for other blog operations
                        .requestMatchers(new AntPathRequestMatcher("/api/test/**")).permitAll() // ✅ Allow test endpoints
                        .requestMatchers(new AntPathRequestMatcher("/h2-console/**")).permitAll() // ✅ Allow H2 Console
                        .anyRequest().authenticated() // ✅ Protect other endpoints
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .headers(headers -> headers
                        .frameOptions(frame -> frame.sameOrigin()) // ✅ Allow H2 Console frame from same origin
                        .httpStrictTransportSecurity(hstsConfig -> hstsConfig.disable())); // ✅ Disable HSTS for H2

        System.out.println("[DEBUG] Security Filter Chain configured successfully");
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
