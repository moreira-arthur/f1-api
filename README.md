## Starting the database server
To start the database server run the following command:
```
    docker compose up -d
    psql -h localhost -p 5432 -U docker -d fia -f db/sql/init.sql
```
This will start the docker enviroment and load the basic information data to the database.

## After you need to install the dependencies
For this use the next command line:
```
npm install
```

## After you need to run the latest migration 
For this use the next command line:
```
npm run knex migrate:latest
```

## Now to run the API 
Run the next command line:
```
npm run dev
```

## Access the following url to see the documentation
Visit this link for the [Documentation](http://localhost:3333/docs)