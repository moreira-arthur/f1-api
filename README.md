## Starting the database server
To start the database server run the following command:
```
    docker compose up -d
    psql -h localhost -p 5432 -U docker -d fia -f db/sql/init.sql
```
This will start the docker enviroment and load the basic information data to the database.