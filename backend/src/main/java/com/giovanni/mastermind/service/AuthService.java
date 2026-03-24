package com.giovanni.mastermind.service;

import com.giovanni.mastermind.dto.AuthResponse;
import com.giovanni.mastermind.dto.LoginRequest;
import com.giovanni.mastermind.dto.SignUpRequest;
import com.giovanni.mastermind.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final UserService userService;

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getLogin(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            throw new BusinessException("Usuário ou senha inválidos");
        } catch (AuthenticationException e) {
            throw new BusinessException("Erro na autenticação: " + e.getMessage());
        }

        UserDetails user = userDetailsService.loadUserByUsername(request.getLogin());
        String token = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .build();
    }

    public AuthResponse signup(SignUpRequest request) {
        // userService.createUser() lança exceção se validações falharem
        // O usuário SÓ é salvo se passar por TODAS as validações
        userService.createUser(request);

        // Se chegou aqui, criou o usuário com sucesso
        UserDetails user = userDetailsService.loadUserByUsername(request.getUsername());
        String token = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .build();
    }
}