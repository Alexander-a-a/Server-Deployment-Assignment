# Census API (Server Deployment Assignment)



# Description

* A ExpressJS API for managing census participants.

* The app seeds the admin user in the db on startup if its not already created.

* Stores participant, work and home details in a normalized MySQL schema.

* MySQL database hosted on **Aiven**.

* Deployed on **Render**.

* All endpoints protected with Basic Auth (admin/P4ssword).

# Tech Stack

* Node.js/Express

* Sequelize ORM

* MySQL (Aiven)

* Render (deployment)

# How to run locally

1. Clone repo

2. ```npm install```

3. Create `.env` with:

   ```env
   ADMIN_USERNAME=avnadmin
   ADMIN_PASSWORD=yourAivenPassword
   DATABASE_NAME=censusdb
   DIALECT=mysql
   DIALECTMODEL=mysql2
   PORT=3000        # optional locally; if omitted the app defaults to 3000
   DATABASE_PORT=24146
   HOST=mysql-xxxxxxx-xxxx.h.aivencloud.com
   ```

   ```ADMIN_USERNAME``` and ```ADMIN_PASSWORD``` are the Aiven MySQL database credentials.

4. ```npm start```

5. Base URL: http://localhost:3000

# Deployment

This API is deployed on **Render** and uses the same MySQL database hosted on **Aiven** as in local development.

- **Production URL**
    https://server-deployment-assignment-iii3.onrender.com

- The Render web service is configured with the same environment variables as the local ```.env``` file.

- On Render the ```PORT``` environment variable is provided by the platform automatically.

# Auth info

* Basic Auth required on all ```/participants``` routes

* Username: admin

* Password: P4ssword

In **Postman**

* Authorization tab → Type: **Basic Auth**.

* Fill in the username and password above.

# Endpoints overview

All endpoints return JSON responses

* ```POST /participants/add```
    Create a new participant (with nested ```participant```, ```work```, ```home``` objects)
* ```GET /participants```
    Get all participants, including work and home details.
* ```GET /participants/details```
    Get basic personal details (email, firstname, lastname) for all participants.
* ```GET /participants/details/:email```
    Get personal details (firstname, lastname, dob) for a specific participant.
* ```GET /participants/work/:email```
    Get work details (companyname, salary, currency) for a specific participant.
* ```GET /participants/home/:email```
    Get home details (country, city) for a specific participant.
* ```PUT /participants/:email```
    Update a participant (and their work + home) by email.
    The email in the URL must match the email in the request body.
* ```DELETE /participants/:email```
    Delete a participant (and their work + home) by email.
