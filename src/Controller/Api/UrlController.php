<?php

namespace App\Controller\Api;

use App\Repository\SessionRepository;
use App\Repository\UrlRepository;
use App\Service\JwtService;
use App\Service\UrlService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\RateLimiter\RateLimiterFactory;
use Symfony\Component\Routing\Attribute\Route;

final class UrlController extends AbstractController
{
    #[Route('/api/urls', methods: ['POST'])]
    public function create(
        Request            $request,
        SessionRepository  $sessionRepository,
        UrlService         $urlService,
        #[\Symfony\Component\DependencyInjection\Attribute\Autowire(
            service: 'limiter.url_create'
        )]
        RateLimiterFactory $rateLimiterFactory,
        JwtService $jwt,
    ): JsonResponse {
        try {
            $session = $this->getSession($jwt, $sessionRepository);
        } catch (\Throwable) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }

        $limiter = $rateLimiterFactory->create((string)$session->getId());
        if (!$limiter->consume()->isAccepted()) {
            return $this->json(['error' => 'Too many requests'], 429);
        }

        $data = json_decode($request->getContent(), true);
        $data['session'] = $session;

        try {
            $url = $urlService->create($data);
        } catch (\InvalidArgumentException $e) {
            return $this->json([
                'error' => $e->getMessage()
            ], 400);
        }

        return $this->json([
            'id' => $url->getId(),
            'shortUrl' => $request->getSchemeAndHttpHost() . '/' . $url->getShortCode(),
        ]);
    }

    #[Route('/api/urls', methods: ['GET'])]
    public function list(SessionRepository $sessionRepository, UrlRepository $urls, JwtService $jwt): JsonResponse
    {
        try {
            $session = $this->getSession($jwt, $sessionRepository);
        } catch (\Throwable) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }

        $list = $urls->findBy([
            'session' => $session,
            'deleted_at' => null,
        ]);

        return $this->json(array_map(fn($url) => [
            'id' => $url->getId(),
            'originalUrl' => $url->getOriginalUrl(),
            'shortCode' => $url->getShortCode(),
            'isPublic' => $url->isPublic(),
            'expiresAt' => $url->getExpiresAt()?->format(DATE_ATOM),
        ], $list));
    }

    #[Route('/api/urls/{id}', methods: ['DELETE'])]
    public function delete(
        int               $id,
        SessionRepository $sessionRepository,
        UrlRepository     $urls,
        UrlService $urlService,
        JwtService $jwt,
    ): JsonResponse
    {
        try {
            $session = $this->getSession($jwt, $sessionRepository);
        } catch (\Throwable) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }

        $url = $urls->find($id);
        if (
            !$url ||
            $url->getSession()->getId() !== $session->getId()
        ) {
            return $this->json(['error' => 'Not found'], 404);
        }

        $urlService->delete($url);

        return $this->json(['status' => 'deleted']);
    }

    #[Route('/api/public', methods: ['GET'])]
    public function publicList(UrlRepository $urls): JsonResponse
    {
        $publicUrls = $urls->findBy([
            'is_public' => true,
            'deleted_at' => null,
        ]);

        return $this->json(array_map(fn($url) => [
            'id' => $url->getId(),
            'originalUrl' => $url->getOriginalUrl(),
            'shortCode' => $url->getShortCode(),
            'isPublic' => $url->isPublic(),
            'expiresAt' => $url->getExpiresAt()?->format(DATE_ATOM),
        ], $publicUrls));
    }

    #[Route('/{shortCode}', methods: ['GET'])]
    public function redirectByShortCode(string $shortCode, UrlService $urlService): RedirectResponse
    {
        $url = $urlService->resolveShortCode($shortCode);

        return new RedirectResponse(
            $url->getOriginalUrl(),
            302
        );
    }

    #[Route('/api/urls/{id}/stats', methods: ['GET'])]
    public function stats(
        int               $id,
        SessionRepository $sessionRepository,
        UrlRepository     $urls,
        UrlService        $stats,
        JwtService $jwt,
    ): JsonResponse
    {
        try {
            $session = $this->getSession($jwt, $sessionRepository);
        } catch (\Throwable) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }

        $url = $urls->findOneBy([
            'id' => $id,
            'session' => $session,
            'deleted_at' => null,
        ]);

        if (!$url) {
            return $this->json(['error' => 'Not found'], 404);
        }

        return $this->json(
            $stats->getStats($url)
        );
    }

    private function getSession(JwtService $jwt, SessionRepository $sessions)
    {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (!str_starts_with($header, 'Bearer ')) {
            throw new \RuntimeException();
        }

        $token = substr($header, 7);
        $sessionId = $jwt->getSessionId($token);

        $session = $sessions->find($sessionId);
        if (!$session) {
            throw new \RuntimeException();
        }

        return $session;
    }
}
