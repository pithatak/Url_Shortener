<?php

namespace App\Service;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtService
{
    public function __construct(
        private string $jwtSecret
    ) {}

    public function createToken(int $sessionId): string
    {
        return JWT::encode([
            'sid' => $sessionId,
            'iat' => time(),
            'exp' => time() + 60 * 60 * 24 * 30,
        ], $this->jwtSecret, 'HS256');
    }

    public function getSessionId(string $token): int
    {
        $payload = JWT::decode($token, new Key($this->jwtSecret, 'HS256'));

        if (!isset($payload->sid)) {
            throw new \RuntimeException('Invalid token');
        }

        return (int)$payload->sid;
    }
}
