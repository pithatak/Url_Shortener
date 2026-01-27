<?php

namespace App\ViewFactory;

use App\Entity\Url;

final class UrlViewFactory
{
    public static function getOneUrlStat(Url $url): array
    {
        return [
            'id' => $url->getId(),
            'createdAt' => $url->getCreatedAt()->format(DATE_ATOM),
            'expiresAt' => $url->getExpiresAt()?->format(DATE_ATOM),
            'clicks' => $url->getClicks(),
        ];
    }

    public static function createList(array $urls): array
    {
        return array_map(fn($url) => [
            'id' => $url->getId(),
            'originalUrl' => $url->getOriginalUrl(),
            'shortCode' => $url->getShortCode(),
            'isPublic' => $url->isPublic(),
            'expiresAt' => $url->getExpiresAt()?->format(DATE_ATOM),
        ], $urls);
    }
}
