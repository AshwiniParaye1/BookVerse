# BookVerse

## Description

BookVerse API is a RESTful API built with Node.js, Express, and MongoDB for managing a digital library. It provides functionalities for managing books, users, and borrowing records, including user authentication, role-based authorization, and CRUD operations for books.

## Features

- User registration and authentication using JWT
- Role-based access control (Admin and User roles)
- CRUD operations for books
- Borrowing and returning books
- User profile management
- Pagination for book listings
- Most frequently borrowed books endpoint

## Technologies Used

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Tokens (JWT) for authentication
- bcrypt for password hashing

## Prerequisites

- Node.js (>=18)
- npm or yarn
- MongoDB - Make sure you have a MongoDB instance running, either locally or remotely (e.g., MongoDB Atlas).

## Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/AshwiniParaye1/BookVerse.git
    ```

2.  Navigate to the project directory:

    ```bash
    cd BookVerse
    ```

3.  Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

4.  Set up environment variables:

    - Create a `.env` file in the root directory.
    - Add the following variables, adjusting values as necessary:

      ```
      PORT=3000
      MONGODB_URI=your-mongoDB-URI
      JWT_SECRET=your-secret-key
      ```

      **Important:** Replace `your-secret-key` with a strong, random secret key for security. Ensure that `MONGODB_URI` points to your MongoDB instance. If you're using MongoDB Atlas, obtain the connection string from the Atlas dashboard.

## Running the Application

```bash
npm run dev
# or
yarn dev
```

The server will start at http://localhost:3000 (or the port you specified in the .env file). You should see a "Listening on: [port]" message in the console.

## API Endpoints

(See detailed API Endpoints section below). Authentication is primarily handled using JWTs. Include the token in the Authorization header as Bearer <token>. Admin-only routes require both authentication and the user having the "admin" role.

## Authentication

The API uses JWT (JSON Web Tokens) for authentication.

To obtain a token, register a new user using the /api/users/register endpoint or log in with an existing user using the /api/users/login endpoint. The response will include a token field.

Include the token in the Authorization header of your requests as follows:

```bash
Authorization: Bearer <your-token>
```

## Authorization

Some endpoints are restricted to users with the "admin" role. These endpoints are protected by the auth middleware and the checkRole middleware. Attempting to access these endpoints without a valid token and the correct role will result in a 401 or 403 error.

## API Endpoints

### Authentication Routes (`/api/user`)

| Method | Route       | Description                                |
| ------ | ----------- | ------------------------------------------ |
| POST   | `/register` | Register a new user                        |
| POST   | `/login`    | Login and get a JWT token                  |
| GET    | `/profile`  | Get user profile (Requires authentication) |

### Book Routes (`/api/book`)

| Method | Route  | Description                     |
| ------ | ------ | ------------------------------- |
| GET    | `/`    | Get all books (with pagination) |
| GET    | `/:id` | Get a specific book             |
| POST   | `/`    | Add a new book (Admin only)     |
| PUT    | `/:id` | Update a book (Admin only)      |
| DELETE | `/:id` | Delete a book (Admin only)      |

### Borrowing Routes (`/api/borrow`)

| Method | Route         | Description               |
| ------ | ------------- | ------------------------- |
| POST   | `/`           | Borrow a book (User only) |
| POST   | `/return/:id` | Return a borrowed book    |
| GET    | `/user`       | Get user's borrowed books |
| GET    | `/popular`    | Get most borrowed books   |

## Testing with Postman

### 1️⃣ Import Postman Collection

To test the API, import the provided Postman collection into Postman.

**Download Postman Collection**: [BookVerse.postman_collection.json]

### Steps to Import:

1. Open Postman
2. Click on Import
3. Select the downloaded **BookVerse.postman_collection.json** file
4. Click Import

### 2️⃣ Authenticate & Get Bearer Token

1. **Register a new user**

   - Endpoint: `POST /api/user/register`
   - Send user details in the request body to create a new account.

2. **Login**

   - Endpoint: `POST /api/user/login`
   - Provide credentials to receive an authentication token.

3. **Copy the received token**
   - Use the returned Bearer token for authenticated requests.

### 3️⃣ Set Authorization in Postman

1. Click on **Authorization** (in any protected route request).
2. Select **Bearer Token**.
3. Paste the copied token.
4. Click **Send**.

#### 📌 Books

- **Get all books** → `GET /api/book`
- **Add a book (Admin)** → `POST /api/book` (Requires Bearer Token with admin role)
- **Update a book (Admin)** → `PUT /api/book/:id`
- **Delete a book (Admin)** → `DELETE /api/book/:id`

#### 📌 Borrowing

- **Borrow a book** → `POST /api/borrow`
- **Return a book** → `POST /api/borrow/return/:id`
- **Get borrowed books** → `GET /api/borrow/user`
- **Get popular books** → `GET /api/borrow/popular`

## Error Handling

The API follows standard error-handling practices with appropriate status codes:

- **400 Bad Request** → Missing or invalid request parameters.
- **401 Unauthorized** → Missing or invalid authentication token.
- **403 Forbidden** → User lacks the necessary permissions.
- **404 Not Found** → Resource not found.
- **500 Internal Server Error** → Unexpected server error.

#### Thank you for checking out BookVerse! If you have any questions or feedback, feel free to reach out.
