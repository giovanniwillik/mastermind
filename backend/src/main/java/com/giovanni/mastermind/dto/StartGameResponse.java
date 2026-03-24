package com.giovanni.mastermind.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StartGameResponse {

    private Long id;
    private UUID gameCode;
    private String message;
}
