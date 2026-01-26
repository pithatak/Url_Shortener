<?php

namespace App\Message;

class UrlClickedMessage
{
    public function __construct(public readonly int $urlId, public readonly \DateTimeImmutable $clickedAt)
    {}
}
