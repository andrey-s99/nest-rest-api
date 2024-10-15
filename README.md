# REST API with NEST JS

## Overview
REST API includes:
- Authentication and Authorization with JWT tokens
- Database handling with PostgreSQL and TypeORM
- CRUD operations
- Response data caching with REDIS
- Containerized with Docker DB and CACHE images

## Technhologies used
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Postgres](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeORM](https://img.shields.io/badge/typeorm-FE0803?style=for-the-badge&logo=typeorm&logoColor=white)
![Redis](https://img.shields.io/badge/redis-CC0000.svg?&style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

## How to run
### Prerequisites
- [Docker](https://www.docker.com/get-started) installed on your machine
- [Docker Compose](https://docs.docker.com/compose/install/) installed (usually included with Docker Desktop)
- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed (for development purposes)

### Instruction
1. **Clone the Repository**

   Open your terminal and clone the repository:

   ```bash
   git clone https://github.com/andrey-s99/nest-rest-api.git
   cd nest-rest-api
   ```
2. **Install dependencies**

   Open your terminal and run:

   ```bash
   npm install
   ```
   
3. **Create .env file**

   Add .env file with custom variables:

   ```dotenv
   POSTGRES_DB=your_database_name
   POSTGRES_USER=your_username
   POSTGRES_PASSWORD=your_password
   POSTGRES_PORT=5433 # Port 5433 is mapped to port 5432 in Docker
   JWT_KEY=your_jwt_secret
   REDIS_USER=your_redis_user
   ```
   Replace the placeholder values with your actual configurations.
   
4. **Run the app**
  
    Use included bash script to run docker and backend together:
     ```bash
     bash run.sh
     ```

## Endpoints
### Authentication
#### POST '/api/auth/sign-up'
Create an account for a new user, sign-ins new user and returns JWT token.

Request BODY:
```json
{
  "username": "aboba",
  "passowrd": "king"
}
```
Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cC..."
}
```
#### POST '/api/auth/sign-in'
Sign-ins existing user, returns JWT token.

Request BODY:
```json
{
  "username": "aboba",
  "passowrd": "king"
}
```
Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cC..."
}
```
### Articles
> POST, PATCH and DELETE methods are protected by JWT authorization.
#### GET 'api/articles'
Returns a list of articles with pagination. 
Additional filters may be specified as query params. Options are: _author_, _startDate_, _endDate_, _page_ and _limit_.

Response:
```json
{
    "data": [
        {
            "id": 8,
            "name": "First",
            "description": "Aboba can change the past.",
            "publishDate": "2024-10-14",
            "author": {
                "username": "aboba"
            }
        }
    ],
    "count": 3,
    "page": 1,
    "limit": 1
}
```
#### POST 'api/articles'
Create a new article.

Request BODY:
```json
{
    "name": "This is my article",
    "description": "Article content",
}
```
Response:
```json
{
    "name": "This is my article",
    "description": "Article content",
    "publishDate": "2024-10-15T12:29:21.579Z",
    "authorId": 1,
    "id": 12
}
```
#### PATCH 'api/articles'
Update description af an article by its id.

Request BODY:
```json
{
    "id": 12,
    "newDescription": "Updated content",
}
```
Response:
```json
{
    "id": 12,
    "name": "This is my article",
    "description": "Updated content",
    "publishDate": "2024-10-15",
    "authorId": 1
}
```
#### DELETE 'api/articles'
Delete an article by its id. User can delete only their own articles.

Request BODY:
```json
{
    "id": 12,
}
```
