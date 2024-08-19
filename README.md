# Event Schduler
## FIRST TIME SETUP INSTRUCTIONS (development)
  1. git clone the repository
  2. create a new branch from the github
  3. create a .env file in the root project directory with the following contents:
  ```
    NODE_ENV = "development"
    POSTGRES_USER="postgres"
    POSTGRES_PASSWORD="docker"
    POSTGRES_DB = "db"
    JWT_SECRET= 'your_secure_secret_here'
  ```
  4. copy that .env into the client and api folders
  5. navigate back to the root directory and run `npm run docker-run`
  6. verify that there are no errors in the terminal.
  7. on your browser navigate to localhost:3000, and localhost:8080 to verify the pages are working
  8. verify the databse was created within your docker container
  9. in your terminal run `docker exec -it api sh` **OR** navigate to the exec tab in the api terminal of your docker desktop application
  10. in the resulting terminal run `npm run knex-reload`

## API Documention
  ### ENDPOINTS
  - `htpp://localhost:8080/users`
    - **FULL CRUD FUNCTIONALITY**
    - ***USAGE:***
      - **POST:** `htpp://localhost:8080/users`
      - **GET:** `htpp://localhost:8080/users`
        - Endpoint uses query functionality the format for which is: `?id=x` *replace x with the id you are searching for*
          - endpoint accepts query `id`, `approver`
          - id is formatted for integers
          - approver is formatted as a boolean
      - **PATCH:** `htpp://localhost:8080/users/:id`
      - **DELETE:** `htpp://localhost:8080/users/:id`
      - standard return without a query will return all events that are classified as requests under the type property

  - `htpp://localhost:8080/events`
    - **FULL CRUD FUNCTIONALITY**
    - ***USAGE:***
      - **POST:** `htpp://localhost:8080/events`
      - **GET:** `htpp://localhost:8080/events`
        - Endpoint uses query functionality the format for which is: `?id=x` *replace x with the id you are searching for*
          - endpoint accepts query `id`
        - standard request without a query will return all events
      - **PATCH:** `htpp://localhost:8080/events/:id`
      - **DELETE:** `htpp://localhost:8080/events/:id`

  - `htpp://localhost:8080/positions`
    - **FULL CRUD FUNCTIONALITY**
    - ***USAGE:***
      - **POST:** `htpp://localhost:8080/positions`
      - **GET:** `htpp://localhost:8080/positions`
        - Endpoint uses query functionality the format for which is: `?id=x` *replace x with the id you are searching for*
          - endpoint accepts query `id`
        - standard request without a query will return all positions
      - **PATCH:** `htpp://localhost:8080/positions/:id`
      - **DELETE:** `htpp://localhost:8080/positions/:id`

  - `htpp://localhost:8080/events/requests`
    - **GET FUNCTIONALITY**
    - ***USAGE:***
      - **GET:** `htpp://localhost:8080/events/requests`
        - Endpoint uses query functionality the format for which is: `?id=x` *replace x with the id you are searching for*
          - endpoint accepts query `id`
      - standard request without a query will return all events that are classified as requests under the type property
        - *please note that it is case specific and for something to be considered an unavailable request you must set the type property to `"Request"`*

  