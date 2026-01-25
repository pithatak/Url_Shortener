<?php

namespace App\Service;

use App\Entity\Url;
use Doctrine\ORM\EntityManagerInterface;

class UrlService
{
    private const EXPIRE_MAP = [
        '1h' => '+1 hour',
        '1d' => '+1 day',
        '1t' => '+1 week',
    ];


    public function __construct(private EntityManagerInterface $em)
    {
    }

    public function create(array $data): Url
    {
        $alias = $data['alias'] ?? null;

        if ($alias) {
            $exists = $this->em->getRepository(Url::class)
                ->findOneBy(['short_code' => $alias]);

            if ($exists) {
                throw new \InvalidArgumentException('Alias already exists');
            }
        } else {
            do {
                $alias = bin2hex(random_bytes(4));
                $exists = $this->em->getRepository(Url::class)
                    ->findOneBy(['short_code' => $alias]);
            } while ($exists);
        }

        $url = new Url();
        $url->setSession($data['session']);
        $url->setOriginalUrl($data['url']);
        $url->setShortCode($alias);
        $url->setIsPublic($data['isPublic'] ?? false);
        $expiresAt = $this->resolveExpiresAt($data['expire'] ?? '1h');

        $url->setExpiresAt($expiresAt);

        $this->em->persist($url);
        $this->em->flush();

        return $url;
    }


    public function delete(Url $url): void
    {
        $url->setDeletedAt(new \DateTimeImmutable());
        $this->em->flush();
    }

    public function resolveShortCode(string $shortCode): Url
    {
        $url = $this->em->getRepository(Url::class)->findOneBy([
            'short_code' => $shortCode,
            'deleted_at' => null,
        ]);

        if (!$url) {
            throw new \RuntimeException('Not found');
        }

        if (
            $url->getExpiresAt() !== null &&
            $url->getExpiresAt() < new \DateTimeImmutable()
        ) {
            throw new \RuntimeException('Expired');
        }

        return $url;
    }

    private function resolveExpiresAt(?string $expire): ?\DateTimeImmutable
    {
        if (!$expire) {
            return null;
        }

        if (!isset(self::EXPIRE_MAP[$expire])) {
            throw new \RuntimeException('Invalid expire value');
        }

        return new \DateTimeImmutable(self::EXPIRE_MAP[$expire]);
    }

    public function click(Url $url): void
    {
        $url->incrementClicks();
        $this->em->flush();
    }

    public function getStats(Url $url): array
    {
        return [
            'id' => $url->getId(),
            'createdAt' => $url->getCreatedAt()->format(DATE_ATOM),
            'expiresAt' => $url->getExpiresAt()?->format(DATE_ATOM),
            'clicks' => $url->getClicks(),
        ];
    }
}
