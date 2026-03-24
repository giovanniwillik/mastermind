package com.giovanni.mastermind.service;

import com.giovanni.mastermind.dto.SignUpRequest;
import com.giovanni.mastermind.exception.UserAlreadyExistsException;
import com.giovanni.mastermind.model.User;
import com.giovanni.mastermind.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User getCurrentUser(Authentication authentication) {
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    public boolean existsByUsername(String username) {
        return userRepository.findByUsername(username).isPresent();
    }

    public boolean existsByEmail(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    /**
     * Cria um novo usuário com todas as validações.
     * O usuário só será salvo no banco se passar por TODAS as validações.
     *
     * @param request dados do novo usuário
     * @return usuário criado
     * @throws UserAlreadyExistsException se username ou email já existem
     */
    @Transactional
    public User createUser(SignUpRequest request) {
        // Validação 1: Username já existe?
        if (existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException(
                    "Usuário '" + request.getUsername() + "' já está registrado"
            );
        }

        // Validação 2: Email já existe?
        if (existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException(
                    "E-mail '" + request.getEmail() + "' já está registrado"
            );
        }

        // Validação 3: Username não pode ser vazio (adicional)
        if (request.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("Username não pode ser vazio");
        }

        // Validação 4: Email não pode ser vazio (adicional)
        if (request.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("E-mail não pode ser vazio");
        }

        // Validação 5: Senha não pode ser vazio (adicional)
        if (request.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Senha não pode ser vazia");
        }

        // Todas as validações passaram: criar e salvar o usuário
        User user = User.builder()
                .username(request.getUsername().trim())
                .email(request.getEmail().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .bestScore(0)
                .build();

        return userRepository.save(user);
    }
}