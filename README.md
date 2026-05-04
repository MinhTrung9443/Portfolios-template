# Portfolios & Templates Project

This is a full-stack web application designed for creating and managing portfolios and templates. 

## Project Structure

The project is divided into two main parts:
- `Portfolios-Templates-BE`: The Spring Boot Backend API.
- `Portfolios-Templates-FE`: The React Frontend Application.

---

## Backend (`Portfolios-Templates-BE`)

The backend is a RESTful API built with Java and Spring Boot.

### Tech Stack
* **Java 17+**
* **Spring Boot 3.x**
* **Spring Security** (JWT Authentication)
* **Redis** (for OTP & Token Management)
* **AWS S3** (for Image/File Storage)
* **SendGrid** (for Email Verification/OTP)
* **Maven**

### Setup Instructions

1.  **Navigate to the backend directory:**
    ```bash
    cd Portfolios-Templates-BE
    ```

2.  **Environment Variables:**
    Create a `.env` file in the root of the backend directory. You can use `.env.example` as a template. Required variables typically include:
    * Database connection details (URL, Username, Password)
    * JWT Secret and Expiration
    * Redis connection details
    * AWS S3 Credentials
    * SendGrid API Key

3.  **Build and Run:**
    Using Maven:
    ```bash
    ./mvnw spring-boot:run
    ```

---

## Frontend (`Portfolios-Templates-FE`)

The frontend is a single-page application built with React, Vite, and Tailwind CSS.

### Tech Stack
* **React**
* **Vite**
* **Tailwind CSS**

### Setup Instructions

1.  **Navigate to the frontend directory:**
    ```bash
    cd Portfolios-Templates-FE
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file if necessary (e.g., to point to the backend API URL).
    ```env
    VITE_API_BASE_URL=http://localhost:8080/api
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Build for production:**
    ```bash
    npm run build
    ```

---

## Deployment
* The backend is configured to be deployable on platforms like Render, Heroku, or AWS.
* The frontend is configured for deployment on Vercel (contains `vercel.json`).
