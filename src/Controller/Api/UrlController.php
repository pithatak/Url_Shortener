<?php

namespace App\Controller\Api;

use App\Entity\Session;
use App\Repository\SessionRepository;
use App\Repository\UrlRepository;
use App\Service\UrlService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

final class UrlController extends AbstractController
{
    #[Route('/api/urls', methods: ['POST'])]
    public function create(Request $request, SessionRepository $sessionRepository, UrlService $urlService): JsonResponse
    {
        $sessionId = (int)$request->cookies->get('SESSION_ID');
        if (!$sessionId) {
            return $this->json(['error' => 'No session'], 401);
        }

        $session = $sessionRepository->find($sessionId);
        if (!$session) {
            return $this->json(['error' => 'Invalid session'], 401);
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
    public function list(Request $request, SessionRepository $sessionRepository, UrlRepository $urls): JsonResponse
    {
        $sessionId = (int)$request->cookies->get('SESSION_ID');
        if (!$sessionId) {
            return $this->json(['error' => 'No session'], 401);
        }

        $session = $sessionRepository->find($sessionId);
        if (!$session) {
            return $this->json(['error' => 'Invalid session'], 401);
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
        Request           $request,
        SessionRepository $sessionRepository,
        UrlRepository     $urls, UrlService $urlService
    ): JsonResponse
    {
        $sessionId = (int)$request->cookies->get('SESSION_ID');
        if (!$sessionId) {
            return $this->json(['error' => 'No session'], 401);
        }

        $session = $sessionRepository->find($sessionId);
        if (!$session) {
            return $this->json(['error' => 'Invalid session'], 401);
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
        Request           $request,
        SessionRepository $sessionRepository,
        UrlRepository     $urls,
        UrlService        $stats
    ): JsonResponse
    {

        $sessionId = (int)$request->cookies->get('SESSION_ID');
        if (!$sessionId) {
            return $this->json(['error' => 'No session'], 401);
        }

        $session = $sessionRepository->find($sessionId);
        if (!$session) {
            return $this->json(['error' => 'Invalid session'], 401);
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

}
