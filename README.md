# F1 API

A RESTful API for Formula 1 data, built with Node.js, TypeScript, Knex, and PostgreSQL.

## Explanation

This project provides a backend API for accessing and managing Formula 1-related data, such as circuits, drivers, constructors, and race results. The data is stored in a PostgreSQL database and can be seeded with CSV and TSV files located in the [`db/data/`](db/data/) directory. Database migrations and seeds are managed using Knex.

**Key directories and files:**

- [`src/`](src/): Main application source code (API, routes, database logic, environment config).
- [`db/`](db/): Database-related files, including:
  - [`data/`](db/data/): Raw data files (CSV/TSV) for seeding the database.
  - [`migrations/`](db/migrations/): Knex migration scripts for schema changes.
  - [`seeds/`](db/seeds/): Knex seed scripts for populating tables.
  - [`sql/`](db/sql/): Raw SQL scripts for database initialization.
- [`knexfile.ts`](knexfile.ts): Knex configuration.
- [`docker-compose.yml`](docker-compose.yml): Docker setup for PostgreSQL.
- [`src/env/`](src/env/): Environment variable validation and loading using [`dotenv`](https://www.npmjs.com/package/dotenv) and [`zod`](https://github.com/colinhacks/zod).

## Starting the database server

To start the database server, run:
```
docker compose up -d
```
This will start the Docker environment with PostgreSQL.

## Install dependencies

Install Node.js dependencies:
```
npm install
```

## Run database migrations

Apply the latest database migrations:
```
npm run knex migrate:latest
```

## Seed the database

Populate the database with initial data:
```
npm run knex seed:run
```

## Run the API

Start the development server:
```
npm run dev
```

## API Documentation

Visit [http://localhost:3333/docs](http://localhost:3333/docs) for API documentation.