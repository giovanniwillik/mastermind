-- Usuário de teste
INSERT INTO users (username, email, password, best_score) VALUES
('admin', 'admin@mastermind.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 800)
ON CONFLICT (username) DO NOTHING;

-- Partida de exemplo para admin (vitória rápida)
INSERT INTO games (user_id, game_code, expected_code, status, final_score, duration_seconds, max_attempts, current_attempt, started_at, finished_at) VALUES
((SELECT id FROM users WHERE username = 'admin'), '550e8400-e29b-41d4-a716-446655440001', 'ABCD', 'WON', 900, 45, 10, 3, '2026-03-23 10:00:00', '2026-03-23 10:00:45')
ON CONFLICT (game_code) DO NOTHING;

-- Tentativas da partida de exemplo
INSERT INTO attempts (game_id, attempt_number, guess, exact_matches, partial_matches, created_at) VALUES
((SELECT id FROM games WHERE game_code = '550e8400-e29b-41d4-a716-446655440001'), 1, 'ABCE', 3, 0, '2026-03-23 10:00:10'),
((SELECT id FROM games WHERE game_code = '550e8400-e29b-41d4-a716-446655440001'), 2, 'ABCD', 4, 0, '2026-03-23 10:00:30'),
((SELECT id FROM games WHERE game_code = '550e8400-e29b-41d4-a716-446655440001'), 3, 'ABCD', 4, 0, '2026-03-23 10:00:45')
ON CONFLICT DO NOTHING;

-- Segunda partida (derrota)
INSERT INTO games (user_id, game_code, expected_code, status, final_score, duration_seconds, max_attempts, current_attempt, started_at, finished_at) VALUES
((SELECT id FROM users WHERE username = 'admin'), '550e8400-e29b-41d4-a716-446655440002', 'EFGH', 'LOST', 0, 300, 10, 10, '2026-03-23 11:00:00', '2026-03-23 11:05:00')
ON CONFLICT (game_code) DO NOTHING;