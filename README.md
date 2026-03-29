# Sudoku Full-Stack Application

A comprehensive, full-stack Sudoku web application featuring user authentication, game state management, and a global leaderboard. Built with a modern React frontend and a robust Spring Boot backend.

##  Features

- **Interactive Sudoku Game**: Play classic Sudoku with real-time validation of moves.
- **User Authentication**: Secure user registration, login, and profile management.
- **Game State Management**: Start new games, resume ongoing ones, and track progress.
- **Global Leaderboard**: Compete with other players and see your ranking based on scores and completion times.
- **Responsive Design**: Play on any device, gracefully styled using Bootstrap.

##  Technology Stack

### Frontend
- **React 19** with **Vite** for blazing fast development and optimized builds.
- **Axios** for API communication.
- **Bootstrap** & **React-Bootstrap** for styling and responsive UI.
- **React-Confetti** for celebration animations upon winning.

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

The repository is organized into two main parts as a monorepo:

- `/Backend`: Contains the Spring Boot Java application (Controllers, Services, Repositories, Entities).
- `/Frontend`: Contains the React application (Components, Pages, API services, Styles).

##  Key API Endpoints

- **Users (`/api/users` or similar)**: Registration, login, profile retrieval.
- **Game (`/api/games` or similar)**: Creating game sessions, making moves, fetching board state.
- **Leaderboard (`/api/leaderboard` or similar)**: Retrieving top scores and rankings.

##  Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

##  License

This project is open-source and available under the standard MIT License.
