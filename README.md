
# SWIFT-code-API

## Author
- **[Filip Mokrzycki](https://github.com/Filipmok-agh)**

---

## Description

This project provides a REST API for managing SWIFT (BIC) codes for banks and their branches. It supports querying, adding, and deleting SWIFT codes from a database.

---

## Technologies Used

- **Backend**: Express, TypeScript  
- **Database**: SQLite with Sequelize ORM  
- **Testing**: Jest  
- **Containerization**: Docker

---

## Running the Application

To run the application and tests in Docker, follow these steps:

1. **Open Docker**:  
   If you don't have Docker installed, download it from the [official website](https://www.docker.com/products/docker-desktop/).

2. **Clone the repository**:
   ```bash
   git clone https://github.com/Filipmok-agh/SWIFT-code-API.git
   ```

3. **Navigate to the project directory**:
   ```bash
   cd ./SWIFT-code-API/solution/
   ```

4. **Build the Docker image**:
   ```bash
   docker build -t swift-code-api .
   ```

5. **Run the tests**:
   ```bash
   docker run --rm --name swift-test swift-code-api npm test
   ```

6. **Run the application**:
   ```bash
   docker run --rm -p 8080:8080 swift-code-api
   ```

---

## Postman

1. **Open Postman**:  
   If you don't have Postman, download it from the [official website](https://www.postman.com/).

2. **Import the [Postman Collection](./Collection.json)**.

3. **Run the application using Docker** 

4. **Try different endpoints using the prepared examples**.

5. **Create your own examples** to test additional use cases.

---

## Endpoints

### 1. **GET**: `/v1/swift-codes/{swift-code}`
Retrieve details of a single SWIFT code, whether for a headquarters or a branch.

#### Response Structure for Headquarter SWIFT code:
```json
{
    "address": "string",
    "bankName": "string",
    "countryISO2": "string",
    "countryName": "string",
    "isHeadquarter": true,
    "swiftCode": "string",
    "branches": [
        {
            "address": "string",
            "bankName": "string",
            "countryISO2": "string",
            "isHeadquarter": false,
            "swiftCode": "string"
        },
        ...
    ]
}
```

#### Response Structure for Branch SWIFT code:
```json
{
    "address": "string",
    "bankName": "string",
    "countryISO2": "string",
    "countryName": "string",
    "isHeadquarter": false,
    "swiftCode": "string"
}
```

### 2. **GET**: `/v1/swift-codes/country/{countryISO2code}`
Return all SWIFT codes with details for a specific country (both headquarters and branches).

#### Response Structure:
```json
{
    "countryISO2": "string",
    "countryName": "string",
    "swiftCodes": [
        {
            "address": "string",
            "bankName": "string",
            "countryISO2": "string",
            "isHeadquarter": true,
            "swiftCode": "string"
        },
        {
            "address": "string",
            "bankName": "string",
            "countryISO2": "string",
            "isHeadquarter": false,
            "swiftCode": "string"
        },
        ...
    ]
}
```

### 3. **POST**: `/v1/swift-codes`
Adds new SWIFT code entries to the database for a specific country.

#### Request Structure:
```json
{
    "address": "string",
    "bankName": "string",
    "countryISO2": "string",
    "countryName": "string",
    "isHeadquarter": true,
    "swiftCode": "string"
}
```

#### Response Structure:
```json
{
    "message": "SWIFT code added successfully."
}
```

### 4. **DELETE**: `/v1/swift-codes/{swift-code}`
Deletes a SWIFT code entry if the `swiftCode` matches the one in the database.

#### Response Structure:
```json
{
    "message": "SWIFT code deleted successfully."
}
```