# Event Schduler
## FIRST TIME SETUP INSTRUCTIONS (development)
  1. git clone the repository
  2. create a new branch from the github
  3. cd into the root directory for the project
  4. run `cd api`
  5. run `npm i`
  6. run `cd ../client`
  7. run `npm i`
  8. run `cd ..`
  9. create a .env file in the root project directory with the following contents:
  ```
    NODE_ENV = "compose"
    POSTGRES_USER="postgres"
    POSTGRES_PASSWORD="docker"
    POSTGRES_DB = "db"
  ```
  10. copy that .env into the client and api folders
  11. navigate back to the root directory and run `npm run docker-run`
  12. verify that there are no errors in the terminal.
  13. on your browser navigate to localhost:3000, and localhost:8080 to verify the pages are working
  14. verify the databse was created within your docker container
  