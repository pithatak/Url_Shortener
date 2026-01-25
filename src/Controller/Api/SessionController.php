<?php

namespace App\Controller\Api;

use App\Repository\SessionRepository;
use App\Service\SessionService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

final class SessionController extends AbstractController
{
    #[Route('/api/session', methods: ['POST'])]
    public function create(SessionService $sessionService): JsonResponse
    {
        $session = $sessionService->create();

        $response = $this->json([
            'sessionId' => (string)$session->getId(),
        ]);

        $response->headers->setCookie(
            new Cookie(
                'SESSION_ID',
                (string)$session->getId(),
                strtotime('+30 days'),
                '/',
                null,
                false,
                true
            )
        );

        return $response;
    }

    #[Route('/api/session', methods: ['GET'])]
    public function get(Request $request, SessionRepository$sessionRepository ): JsonResponse
    {
        $sessionId = (int)$request->cookies->get('SESSION_ID');
        if (!$sessionId) {
            return $this->json(['error' => 'No session'], 401);
        }

        $session = $sessionRepository->find($sessionId);
        if (!$session) {
            return $this->json(['error' => 'Invalid session'], 401);
        }

        return $this->json([
            'id' => (string)$session->getId(),
            'createdAt' => $session->getCreatedAt(),
        ]);
    }
}
