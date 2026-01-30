# URL Shortener API (Symfony)

This project is a small REST API built with **Symfony**, **Doctrine**, **PostgreSQL**, **JWT authentication**, and **RabbitMQ** for async click tracking. The API allows you to create short URLs, resolve them, and collect click statistics. Sessions are authenticated using JWT tokens.

---

## Tech Stack

* PHP 8.4
* Symfony
* Doctrine ORM
* PostgreSQL
* Firebase JWT
* RabbitMQ
* Docker & Docker Compose

---

## Project Setup (Docker)

### 1. Copy environment file:

From the project root:

```bash
   cp .env.example .env
```
### 2. Build and start containers

From the project root:

```bash
docker compose up -d --build
```

This will:

* build PHP, Nginx, RabbitMQ and PostgreSQL containers
* start all required services

---

## API Usage

### 1. Create a session (required first)

Before using protected endpoints, you **must create a session**.

**Endpoint:**

```
POST /api/session
```

**Response:**

```json
{
  "token": "<JWT_TOKEN>"
}
```

Save this token — it will be used as a **Bearer token**.

---

### 2. Get current session

**Endpoint:**

```
GET /api/session
```

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Response:**

```json
{
  "id": "<session_id>",
  "createdAt": "2026-01-26T21:40:00+00:00"
}
```

---

## URL API

### 1. Create short URL

**Endpoint:**

```
POST /api/urls
```

**Headers (required):**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body:**

```json
{
  "url": "https://example.com",
  "alias": "optional-alias",
  "expire": "1h",
  "isPublic": false
}
```

**Notes:**

* `alias` is optional (auto-generated if missing)
* `expire` can be: `1h`, `1d`, `1t`
* private URLs require authentication to access stats
* Rate limit: max 10 links / minute / session

**Response:**

```json
{
  "id": "1",
  "shortUrl": "http://localhost:57000/shortUrl"
}
```

---

### 2. Show list of own links

**Endpoint:**

```
GET /api/urls
```

**Headers (required):**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Notes:**

* Doesn't show deleted links.

**Response:**

```json
{
  "id": "1",
  "originalUrl": "http://localhost:57000/originalUrl",
  "shortUrl": "alias",
  "isPublic": "true/false",
  "expiresAt": "2026-01-26T21:40:00+00:00"
}
```

---

### 3. Get link statistics

**Endpoint:**

```
GET /api/urls/{link_id}/stats
```

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

Returns click count and metadata. Access is restricted to the session owner unless the URL is public.

**Response:**

```json
{
  "id": "1",
  "createdAt": "2025-01-26T21:40:00+00:00",
  "expiresAt": "2026-01-26T21:40:00+00:00",
  "clicks": "0"
}
```

---

### 4. Delete link

**Endpoint:**

```
DELETE /api/urls/{link_id}
```

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

* Performs "soft delete"

**Response:**

```json
{
  "status": "deleted"
}
```

---

### 5. Show list of public links

**Endpoint:**

```
GET /api/public 
```

**Response:**

```json
{
  "id": "1",
  "originalUrl": "http://localhost:57000/originalUrl",
  "shortCode": "alias",
  "isPublic": "true/false",
  "expiresAt": "2026-01-26T21:40:00+00:00"
}
```

---

### 6. Resolve short URL

**Endpoint:**

```
GET /{shortCode}
```

* Redirects to original URL
* Sends click event to Messenger

No authentication required.

---

## Authentication Rules

* JWT token must be passed as `Authorization: Bearer <token>`
* Some endpoints are **public** (redirect)
* Some endpoints require **authenticated session**
* Session must be created first

---

## Tests

Unit tests are provided for core services (minimum required by task):

```bash
php bin/phpunit
```

---

## Notes

* Click tracking works asynchronously via Messenger
* Without running the worker, clicks will not be persisted
* API errors are returned as JSON using a global exception listener

---

## Final Notes

This project focuses on:

* clean architecture
* explicit session-based authentication
* minimal but sufficient test coverage

Further tests and features can be added if required.
