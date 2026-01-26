<?php

namespace App\MessageHandler;

use App\Message\UrlClickedMessage;
use App\Repository\UrlRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class UrlClickedHandler
{
    public function __construct(private UrlRepository $urls, private EntityManagerInterface $em)
    {}

    public function __invoke(UrlClickedMessage $message): void
    {
        $url = $this->urls->find($message->urlId);

        if (!$url) {
            return;
        }

        $url->incrementClicks();

        $this->em->flush();
    }
}

