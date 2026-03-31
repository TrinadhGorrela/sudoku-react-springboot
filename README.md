# Sudoku Full-Stack Application

A comprehensive, full-stack Sudoku web application featuring user authentication, game state management, and persistent gameplay data. Built with a modern React frontend and a robust Spring Boot backend.

##  Features

- **Interactive Sudoku Game**: Play classic Sudoku with move validation, undo, hints, and win detection.
- **User Authentication**: User registration and login, plus game statistics (`/api/user/{userId}/stats`).
- **Game State Management**: Start new games, resume stored games, and track progress (board, mistakes, notes).
- **Responsive Design**: Styled with Bootstrap/React-Bootstrap to work on different screen sizes.

##  Technology Stack

### Frontend
- **React 19** with **Vite** for fast development and optimized builds.
- **Fetch API** for communicating with the backend (Vite proxy forwards `/api/*` to Spring Boot).
- **Bootstrap** & **React-Bootstrap** for styling and responsive UI.
- **React-Confetti** for celebration animations upon winning (when enabled in the UI).

### Backend
- **Java 17** & **Spring Boot 3.5.5** for the robust API layer.
- **Spring Data JPA** & **Hibernate** for database interaction.
- **MySQL** as the relational database.
- **Lombok** to reduce boilerplate code.
- **Validation** for securing data integrity.

##  Prerequisites

Before you begin, ensure you have met the following requirements:
- **Java Development Kit (JDK) 17** or higher.
- **Node.js** (v18+ recommended) and **npm**.
- **MySQL Server** (running locally or remotely).
- **Maven** (optional, as the project includes the Maven Wrapper `mvnw`).

##  Installation & Setup

### 1. Database Configuration
1. Start your MySQL server.
2. Create a new database named `sudoku_db`.
   ```sql
   CREATE DATABASE sudoku_db;
   ```
3. Update the database credentials in `Backend/src/main/resources/application.properties` if they differ from the defaults (`root` / `bunny`).

### 2. Backend Setup
1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Build and run the Spring Boot application using Maven Wrapper:
   ```bash
   # On Windows
   ./mvnw.cmd spring-boot:run
   
   # On macOS/Linux
   ./mvnw spring-boot:run
   ```
   The backend API will typically start on `http://localhost:8080`.

### 3. Frontend Setup
1. Open a new terminal and navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173` (or the port specified by Vite).

##  Project Structure

The repository is organized into two main parts (monorepo):

- `/Backend`: Spring Boot REST API + MySQL persistence
- `/Frontend`: React + Vite UI that calls the backend via `/api/*`

### Directory Layout

```text
Sudoku/
  Backend/
    src/main/java/com/sudoku/
      controller/   (REST endpoints: /api/game, /api/user)
      service/      (game + user business logic)
      repository/   (JPA repositories)
      entity/       (JPA entities mapped to MySQL tables)
      dto/           (request/response models)
      mapper/        (maps entities <-> DTO/state)
      util/          (board generation/validation helpers)
      config/        (CORS / web configuration)
    src/main/resources/
      application.properties (MySQL credentials + server port)
    mvnw.cmd / mvnw (Maven wrapper)

  Frontend/
    src/
      components/  (React components + modals)
      hooks/       (custom React hooks, e.g. useSudokuGame.js)
      services/    (API client: api.js)
      utils/       (helpers: scoring, storage)
      App.jsx, main.jsx
    vite.config.js (dev server + proxy for /api -> http://localhost:8080)
    package.json
```

##  Key API Endpoints
- **User APIs (`/api/user`)**
  - `POST /api/user/register` - register a new user
  - `POST /api/user/login` - login and return user info
  - `GET /api/user/{userId}/stats` - retrieve user statistics

- **Game APIs (`/api/game`)**
  - `POST /api/game/start?difficulty=MEDIUM` - create a new Sudoku game
  - `GET /api/game/{gameId}` - get current puzzle/board state
  - `POST /api/game/{gameId}/move` - place a number in a cell
  - `POST /api/game/{gameId}/undo` - undo last move
  - `GET /api/game/{gameId}/hint` - get a hint for the current board
  - `POST /api/game/{gameId}/validate` - validate if the puzzle is solved
  - `DELETE /api/game/{gameId}` - delete/cleanup a game

##  Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

##  License

This project is open-source and available under the standard MIT License.

## Notes / Next Improvements (optional)
- Add a short `Frontend/.env.example` and `Backend/.env.example` (if you later move secrets out of `application.properties`).
- Add DB migration tooling (Flyway/Liquibase) if you want automatic table creation.
- Add a short “Troubleshooting” section for common issues (MySQL not running, wrong DB password, ports in use).
