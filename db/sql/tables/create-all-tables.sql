-- Table: SEASONS
CREATE TABLE SEASONS (
    Year SMALLINT,              -- Years between 1974 and 2010 (SMALLINT supports up to 32767)
    URL TEXT,                   -- Long URLs (e.g., Wikipedia links)
    CONSTRAINT YEAR_PK PRIMARY KEY (Year)  -- Primary key based on the year
);

-- Table: STATUS
CREATE TABLE STATUS (
    StatusId SMALLINT,          -- IDs up to 141 (SMALLINT supports up to 32767)
    Status VARCHAR(50),         -- Descriptions up to 50 characters (e.g., "Collision damage")
    CONSTRAINT STATUSID_PK PRIMARY KEY (StatusId)
);

-- Table: AIRPORTS
CREATE TABLE AIRPORTS (
    Id INT,                     -- Unique identifier for each airport
    Ident VARCHAR(10),          -- Short codes (e.g., "00A", "00AA")
    Type VARCHAR(20),           -- Categories like "heliport" or "small_airport"
    Name TEXT,                  -- Long names (e.g., "Total RF Heliport")
    LatitudeDeg DECIMAL(9,6),   -- Precision up to 6 decimal places (e.g., 40.070985)
    LongitudeDeg DECIMAL(9,6),  -- Precision up to 6 decimal places (e.g., -74.933689)
    ElevationFt INT,            -- Altitude in feet (e.g., 11, 3435)
    Continent CHAR(2),          -- Continent codes (e.g., "NA", "OC")
    ISOCountry CHAR(2),         -- ISO country codes (e.g., "US")
    ISORegion VARCHAR(10),      -- Region codes (e.g., "US-PA")
    Municipality TEXT,          -- Municipality names (e.g., "Bensalem")
    ScheduledService BOOLEAN,   -- "yes" → TRUE / "no" → FALSE
    ICAOCode VARCHAR(4),        -- ICAO codes (e.g., "K00A")
    IATACode VARCHAR(3),        -- IATA codes (e.g., "00A")
    GPSCode VARCHAR(10),        -- GPS codes (e.g., "K00A")
    LocalCode VARCHAR(10),      -- Local codes (e.g., "00A")
    HomeLink TEXT,              -- Long URLs (e.g., official website links)
    WikipediaLink TEXT,         -- Wikipedia URLs
    Keywords TEXT,              -- List of keywords
    CONSTRAINT ID_PK_AIRPORTS PRIMARY KEY (Id)
);

-- Table: CIRCUITS
CREATE TABLE CIRCUITS (
    CircuitID INT,              -- Unique identifier for each circuit
    CircuitRef VARCHAR(50),     -- Short predictable values (e.g., "hockenheimring")
    Name VARCHAR(100),          -- Long names (e.g., "Circuit de Nevers Magny-Cours")
    Location VARCHAR(50),       -- Cities/regions (e.g., "Magny Cours")
    Country VARCHAR(50),        -- Country names (e.g., "United Kingdom")
    Lat DECIMAL(9,6),           -- Latitude with precision up to 6 decimal places
    Lng DECIMAL(9,6),           -- Longitude with precision up to 6 decimal places
    Alt SMALLINT,               -- Altitude in meters (e.g., 228)
    URL TEXT,                   -- Long URLs (e.g., Wikipedia links)
    CONSTRAINT CIRCUITID_PK PRIMARY KEY (CircuitID)
);

-- Table: RACES
CREATE TABLE RACES (
    RaceId INT,                 -- Unique identifier for each race
    Year SMALLINT,              -- Year of the race
    Round SMALLINT,             -- Round number in the season
    CircuitId INT,              -- Foreign key referencing CIRCUITS(CircuitID)
    Name VARCHAR(100),          -- Name of the race
    Date DATE,                  -- Date of the race
    Time TIME,                  -- Time of the race
    URL TEXT,                   -- Long URLs (e.g., Wikipedia links)
    FP1Date DATE,               -- Date of the first practice session
    FP1Time TIME,               -- Time of the first practice session
    FP2Date DATE,               -- Date of the second practice session
    FP2Time TIME,               -- Time of the second practice session
    FP3Date DATE,               -- Date of the third practice session
    FP3Time TIME,               -- Time of the third practice session
    QualiDate DATE,             -- Date of the qualifying session
    QualiTime TIME,             -- Time of the qualifying session
    SprintDate DATE,            -- Date of the sprint session
    SprintTime TIME,            -- Time of the sprint session
    CONSTRAINT RACEID_PK PRIMARY KEY (RaceId),
    CONSTRAINT CIRCUITID_FK_RACES FOREIGN KEY (CircuitId) REFERENCES CIRCUITS(CircuitID),
    CONSTRAINT YEAR_FK_RACES FOREIGN KEY (Year) REFERENCES SEASONS(Year)
);

-- Table: CONSTRUCTORS
CREATE TABLE CONSTRUCTORS (
    ConstructorID INT,          -- Unique identifier for each constructor
    ConstructorRef VARCHAR(50), -- Short consistent IDs (e.g., "force_india")
    Name VARCHAR(50),           -- Team names (e.g., "Brawn GP")
    Nationality VARCHAR(50),    -- Nationalities (e.g., "British")
    URL TEXT,                   -- Long URLs (e.g., Wikipedia links)
    CONSTRAINT CONSTRUCTORID_PK PRIMARY KEY (ConstructorID)
);

-- Table: COUNTRIES
CREATE TABLE COUNTRIES (
    Id INT,                     -- Unique identifier for each country
    Code CHAR(2),               -- Fixed 2-letter ISO codes (e.g., "AD", "BR")
    Name VARCHAR(100),          -- Full names (e.g., "Democratic Republic of the Congo")
    Continent VARCHAR(10),      -- Continent codes (e.g., "EU", "SA", "AN")
    WikipediaLink TEXT,         -- Long Wikipedia URLs
    Keywords TEXT,              -- List of keywords
    CONSTRAINT ID_PK PRIMARY KEY (Id)
);

-- Table: DRIVER
CREATE TABLE DRIVER (
    DriverId INT,               -- Unique identifier for each driver
    DriverRef VARCHAR(50),      -- Values like "michael_schumacher"
    Number SMALLINT,            -- Numbers up to 99 (supports up to 32,767)
    Code VARCHAR(3),            -- Fixed 3-letter codes (e.g., "HAM")
    Forename VARCHAR(100),      -- Long first names (e.g., "Juan Pablo Montoya")
    Surname VARCHAR(100),       -- Last names with special characters (e.g., "Räikkönen")
    DateOfBirth DATE,           -- Standard DATE format (e.g., 1985-01-07)
    Nationality VARCHAR(50),    -- Nationalities (e.g., "Colombian")
    URL TEXT,                   -- Long URLs (e.g., Wikipedia links)
    CONSTRAINT DRIVERID_PK PRIMARY KEY (DriverId)
);

-- Table: DRIVERSTANDINGS
CREATE TABLE DRIVERSTANDINGS (
    DriverStandingsId INT,      -- Unique identifier for each driver standing
    RaceId INT,                 -- Foreign key referencing RACES(RaceId)
    DriverId INT,               -- Foreign key referencing DRIVER(DriverId)
    Points DECIMAL(6,1),        -- Allows decimal values (e.g., 12.5)
    Position SMALLINT,          -- Position in the standings
    PositionText VARCHAR(3),    -- Text representation of the position
    Wins SMALLINT,              -- Number of wins
    CONSTRAINT DRIVERSTANDINGSID_PK PRIMARY KEY (DriverStandingsId),
    CONSTRAINT RACEID_FK_DRIVERSTANDINGS FOREIGN KEY (RaceId) REFERENCES RACES(RaceId),
    CONSTRAINT DRIVERID_FK_DRIVERSTANDINGS FOREIGN KEY (DriverId) REFERENCES DRIVER(DriverId)
);

-- Table: GEOCITIES15K
CREATE TABLE GEOCITIES15K (
    GeonameId INT,              -- Unique identifier for each city
    Name VARCHAR(255),          -- Name of the city
    AsciiName VARCHAR(255),     -- ASCII version of the city name
    AlternateNames TEXT,        -- List of alternate names
    Lat DECIMAL(9,6),           -- Latitude with precision up to 6 decimal places
    Long DECIMAL(9,6),          -- Longitude with precision up to 6 decimal places
    FeatureClass CHAR(1),       -- Main category (e.g., 'P' for city)
    FeatureCode VARCHAR(10),    -- Subcategory (e.g., 'PPLA' for administrative capital)
    Country CHAR(2),            -- 2-letter ISO code
    CC2 VARCHAR(255),           -- Secondary country codes
    Admin1Code VARCHAR(20),     -- Admin level 1 code
    Admin2Code VARCHAR(80),     -- Admin level 2 code
    Admin3Code VARCHAR(20),     -- Admin level 3 code
    Admin4Code VARCHAR(20),     -- Admin level 4 code
    Population BIGINT,          -- Population can reach millions
    Elevation INT,              -- Elevation in meters
    Dem INT,                    -- Digital elevation model
    TimeZone VARCHAR(50),       -- Time zone name (e.g., 'Asia/Dubai')
    ModificationDate DATE,      -- Last update date
    CONSTRAINT GEONAMEID_PK PRIMARY KEY (GeonameId)
);

-- Table: LAPTIMES
CREATE TABLE LAPTIMES (
    RaceId INT,                 -- Foreign key referencing RACES(RaceId)
    DriverId INT,               -- Foreign key referencing DRIVER(DriverId)
    Lap SMALLINT,               -- Lap number
    Position SMALLINT,          -- Position during the lap
    Time VARCHAR(12),           -- Variable format (e.g., "1:27.451")
    Milliseconds INT,           -- Time in milliseconds
    CONSTRAINT RACEID_DRIVERID_LAP_PK PRIMARY KEY (RaceId, DriverId, Lap),
    CONSTRAINT RACEID_FK_LAPTIMES FOREIGN KEY (RaceId) REFERENCES RACES(RaceId) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT DRIVERID_FK_LAPTIMES FOREIGN KEY (DriverId) REFERENCES DRIVER(DriverId) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table: PITSTOPS
CREATE TABLE PITSTOPS (
    RaceId INT,                 -- Foreign key referencing RACES(RaceId)
    DriverId INT,               -- Foreign key referencing DRIVER(DriverId)
    Stop SMALLINT,              -- Stop number
    Lap SMALLINT,               -- Lap number
    Time VARCHAR(12),           -- Variable format (e.g., "1:27.451")
    Duration VARCHAR(255),      -- Duration in seconds with 3 decimal places
    Milliseconds INT,           -- Duration in milliseconds
    CONSTRAINT RACEID_DRIVERID_STOP_PK PRIMARY KEY (RaceId, DriverId, Stop),
    CONSTRAINT RACEID_FK_PITSTOPS FOREIGN KEY (RaceId) REFERENCES RACES(RaceId) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT DRIVERID_FK_PITSTOPS FOREIGN KEY (DriverId) REFERENCES DRIVER(DriverId) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table: QUALIFYING
CREATE TABLE QUALIFYING (
    QualifyId INT,              -- Unique identifier for each qualifying session
    RaceId INT,                 -- Foreign key referencing RACES(RaceId)
    DriverId INT,               -- Foreign key referencing DRIVER(DriverId)
    ConstructorId INT,          -- Foreign key referencing CONSTRUCTORS(ConstructorID)
    Number SMALLINT,            -- Car number (e.g., 22, 4)
    Position SMALLINT,          -- Qualifying position (1 to 20+)
    Q1 VARCHAR(12),             -- Q1 time in "MM:SS.mmm" format
    Q2 VARCHAR(12),             -- Q2 time (nullable)
    Q3 VARCHAR(12),             -- Q3 time (nullable)
    CONSTRAINT QUALIFYID_PK PRIMARY KEY (QualifyId),
    CONSTRAINT RACEID_FK_QUALIFYING FOREIGN KEY (RaceId) REFERENCES RACES(RaceId),
    CONSTRAINT DRIVERID_FK_QUALIFYING FOREIGN KEY (DriverId) REFERENCES DRIVER(DriverId),
    CONSTRAINT CONSTRUCTORID_FK_QUALIFYING FOREIGN KEY (ConstructorId) REFERENCES CONSTRUCTORS(ConstructorID)
);

-- Table: RESULTS
CREATE TABLE RESULTS (
    ResultId INT,               -- Unique identifier for each result
    RaceId INT,                 -- Foreign key referencing RACES(RaceId)
    DriverId INT,               -- Foreign key referencing DRIVER(DriverId)
    ConstructorId INT,          -- Foreign key referencing CONSTRUCTORS(ConstructorID)
    Number SMALLINT,            -- Car number
    Grid SMALLINT,              -- Starting grid position
    Position SMALLINT,          -- Final position (nullable)
    PositionText VARCHAR(3),    -- Text representation of the position
    PositionOrder SMALLINT,     -- Order of the position
    Points DECIMAL(6,1),        -- Points scored (e.g., 12.5)
    Laps SMALLINT,              -- Number of laps completed
    Time VARCHAR(12),           -- Race time (nullable)
    Milliseconds INT,           -- Race time in milliseconds (nullable)
    FastestLap SMALLINT,        -- Fastest lap number (nullable)
    Ranking SMALLINT,           -- Ranking (renamed from "Rank" to avoid reserved word conflict)
    FastestLapTime VARCHAR(10), -- Fastest lap time in "MM:SS.mmm" format (nullable)
    FastestLapSpeed VARCHAR(255), -- Speed during the fastest lap (nullable)
    StatusId SMALLINT,          -- Foreign key referencing STATUS(StatusId)
    CONSTRAINT RESULTID_PK PRIMARY KEY (ResultId),
    CONSTRAINT RACEID_FK_RESULTS FOREIGN KEY (RaceId) REFERENCES RACES(RaceId),
    CONSTRAINT DRIVERID_FK_RESULTS FOREIGN KEY (DriverId) REFERENCES DRIVER(DriverId),
    CONSTRAINT CONSTRUCTORID_FK_RESULTS FOREIGN KEY (ConstructorId) REFERENCES CONSTRUCTORS(ConstructorID),
    CONSTRAINT STATUSID_FK_RESULTS FOREIGN KEY (StatusId) REFERENCES STATUS(StatusId)
);
