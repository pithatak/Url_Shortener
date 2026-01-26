FROM php:8.4-fpm

WORKDIR /application

# system deps
RUN apt-get update && apt-get install -y \
    git \
    zip \
    unzip \
    libzip-dev \
    libpq-dev \
    postgresql-client \
    librabbitmq-dev \
    && docker-php-ext-install \
        pdo \
        pdo_pgsql \
        zip

# amqp
RUN pecl install amqp \
    && docker-php-ext-enable amqp

# composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
