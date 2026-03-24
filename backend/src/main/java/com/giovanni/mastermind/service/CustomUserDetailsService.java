package com.giovanni.mastermind.service;

import com.giovanni.mastermind.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        com.giovanni.mastermind.model.User user = userRepository.findByUsernameOrEmail(login, login)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + login));

        return new User(user.getUsername(), user.getPassword(), new ArrayList<>());
    }
}