
# Campaign Media Planning Application

This application helps optimize ad spend across various platforms by calculating the maximum budget for a specific ad while ensuring the total campaign budget remains within the approved amount. The application uses a Goal Seek algorithm to achieve this optimization.




## Application Components

- Backend (ASP.NET Core): 

    Handles the calculation of the maximum budget based on user input and predefined business logic.

- Frontend (React)

    Provides a user interface for inputting campaign data and displaying results.






## Getting Started


## Prerequisites

- .NET SDK (for backend)
- Node.js (for frontend)
- npm (for frontend dependency management)

## Setup

```bash
  git clone https://github.com/Sachin498/Denitsu_traineeship.git
```
Navigate to the Backend directory 'Dentsu'

Build and Run the Backend
```bash
    dotnet build
    dotnet run
```
The backend will start on http://localhost:5230.

Navigate to the Frontend Directory

```bash
    cd ../frontend
```
Install Dependencies
```bash
    npm install
```
Run the frontend
```bash
    npm start
```
The frontend will be accessible at http://localhost:3000.

### CORS Configuration
The backend is configured to allow requests from the React app running on http://localhost:3000. Ensure this URL is correct in the Program.cs file of the backend.

### Running the application

- Navigate to http://localhost:3000 in your browser.

- Fill out the form 

    Input the following details:
    - Total Budget
    - Fixed Costs
    - Agency Fee Percentage
    - Third-Party Fee Percentage
    - Other Ad Budgets (comma-separated)

- Click "Calculate"
    The application will display the maximum budget for the ad and any validation or error messages.


## Test Cases

### Test Case 1: Valid Inputs
[![Alt text](/Screenshots/Valid.png)
The application calculates and displays the maximum budget for the specific ad that fits within the total budget.

### Test Case 2: Exceeding total budget
[![Alt text](/Screenshots/Invalid_1.png)

### Test Case 3: Insufficient ads
[![Alt text](/Screenshots/Invalid_2.png)

### Test Case 4: Budget for ads exceeding total Budget
[![Alt text](/Screenshots/Invalid_3.png)



