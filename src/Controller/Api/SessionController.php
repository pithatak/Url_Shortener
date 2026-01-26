<?php

namespace App\Controller\Api;

use App\Repository\SessionRepository;
use App\Service\JwtService;
use App\Service\SessionService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class SessionController extends AbstractController
{
    #[Route('/api/session', methods: ['POST'])]
    public function create(
        SessionService $sessionService,
        JwtService $jwt
    ): JsonResponse {
        $session = $sessionService->create();

        return $this->json([
            'token' => $jwt->createToken($session->getId()),
        ]);
    }

    #[Route('/api/session', methods: ['GET'])]
    public function get(
        JwtService $jwt,
        SessionRepository $sessions
    ): JsonResponse {
        try {
            $token = $this->getBearerToken();
            $sessionId = $jwt->getSessionId($token);
            $session = $sessions->find($sessionId);

            if (!$session) {
                throw new \RuntimeException();
            }
        } catch (\Throwable) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }

        return $this->json([
            'id' => (string)$session->getId(),
            'createdAt' => $session->getCreatedAt(),
        ]);
    }

    private function getBearerToken(): string
    {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

        if (!str_starts_with($header, 'Bearer ')) {
            throw new \RuntimeException();
        }

        return substr($header, 7);
    }
}
