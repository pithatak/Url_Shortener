<?php

namespace App\Controller\Api;

use App\Repository\UrlRepository;
use App\Service\SessionAuthService;
use App\Service\UrlService;
use App\ViewFactory\UrlViewFactory;
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
        SessionAuthService $sessionAuthService,
        UrlService         $urlService,
        #[\Symfony\Component\DependencyInjection\Attribute\Autowire(
            service: 'limiter.url_create'
        )]
        RateLimiterFactory $rateLimiterFactory
    ): JsonResponse
    {
        $session = $sessionAuthService->getSessionFromRequest($request);

        $limiter = $rateLimiterFactory->create((string)$session->getId());
        if (!$limiter->consume()->isAccepted()) {
            return $this->json(['error' => 'Too many requests'], 429);
        }

        $data = json_decode($request->getContent(), true);
        $data['session'] = $session;

        $url = $urlService->create($data);

        return $this->json([
            'id' => $url->getId(),
            'shortUrl' => $request->getSchemeAndHttpHost() . '/' . $url->getShortCode(),
        ]);
    }

    #[Route('/api/urls', methods: ['GET'])]
    public function list(Request            $request,
                         SessionAuthService $sessionAuthService,
                         UrlRepository      $urls
    ): JsonResponse
    {
        $session = $sessionAuthService->getSessionFromRequest($request);

        $list = $urls->findBy([
            'session' => $session,
            'deleted_at' => null,
        ]);

        return $this->json(UrlViewFactory::createList($list));
    }

    #[Route('/api/urls/{id}', methods: ['DELETE'])]
    public function delete(
        int                $id,
        Request            $request,
        SessionAuthService $sessionAuthService,
        UrlService         $urlService
    ): JsonResponse
    {
        $session = $sessionAuthService->getSessionFromRequest($request);

        $urlService->deleteForSession($id, $session);

        return $this->json(['status' => 'deleted']);
    }

    #[Route('/api/public', methods: ['GET'])]
    public function publicList(UrlRepository $urls): JsonResponse
    {
        $publicUrls = $urls->findBy([
            'is_public' => true,
            'deleted_at' => null,
        ]);

        return $this->json(UrlViewFactory::createList($publicUrls));
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
        int                $id,
        Request            $request,
        SessionAuthService $sessionAuthService,
        UrlRepository      $urls
    ): JsonResponse
    {
        $session = $sessionAuthService->getSessionFromRequest($request);

        $url = $urls->findOneBy([
            'id' => $id,
            'session' => $session,
            'deleted_at' => null,
        ]);

        if (!$url) {
            return $this->json(['error' => 'Not found'], 404);
        }

        return $this->json(UrlViewFactory::getOneUrlStat($url));
    }
}
