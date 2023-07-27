# Bitnine Internship Test Web Server

Welcome to the Bitnine Internship Test web server! This server is specifically designed to meet the requirements of the internship test. It features a scalable folder structure and provides multiple API endpoints following RESTful API guidelines.

## API Endpoints

The server offers the following API endpoints for user-related operations:

- **POST /signUp:** Register a new user account.
- **POST /signIn:** Authenticate and sign in a user.
- **GET /confirm/:token:** Confirm user account using a unique token.
- **POST /sendConfirm:** Resend confirmation email to a user.
- **POST /forgotPassword:** Initiate the password recovery process for a user.
- **POST /resetPassword:** Reset the user's password after successful verification.
- **GET /getUser:** Retrieve user information (protected route using middleware).

## Technologies Used

This server is built with the powerful and reliable Express framework, and it utilizes PostgreSQL as the database, hosted on Render.com. The server is equipped with the following essential packages:

- **bcryptjs** (^2.4.3): A library for hashing and salting passwords to enhance security.
- **body-parser** (^1.20.2): Middleware to parse incoming request bodies.
- **cors** (^2.8.5): Middleware to enable Cross-Origin Resource Sharing.
- **dotenv** (^16.3.1): For loading environment variables from a .env file.
- **express** (^4.18.2): The web application framework for Node.js, providing robust routing and middleware capabilities.
- **jsonwebtoken** (^9.0.1): For generating and verifying JSON Web Tokens for secure authentication.
- **jwt-decode** (^3.1.2): Library to decode JSON Web Tokens on the client-side.
- **nodemailer** (^6.9.4): A module for sending emails from the server, essential for confirmation and password recovery functionality.
- **pg** (^8.11.1): The PostgreSQL client library for Node.js, allowing seamless interaction with the database.

## Scalable Folder Structure

To ensure that the server remains maintainable and adaptable for future improvements, it has been developed with a scalable folder structure. This organization helps in better code management and facilitates the addition of new features and enhancements in the future.

Thank you for using the Bitnine Internship Test web server. If you have any questions or feedback, please feel free to reach out.
