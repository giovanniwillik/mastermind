package com.giovanni.mastermind.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {
    @NotBlank(message = "Usuário ou e-mail é obrigatório")
    private String login; // Pode ser username ou email

    @NotBlank(message = "A senha é obrigatória")
    private String password;
}