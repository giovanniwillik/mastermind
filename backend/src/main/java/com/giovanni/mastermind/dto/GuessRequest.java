package com.giovanni.mastermind.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GuessRequest {

    @NotBlank(message = "Palpite é obrigatório")
    @Pattern(regexp = "[A-F]{4}", message = "Palpite deve ter exatamente 4 cores (A-F)")
    private String guess;
}
