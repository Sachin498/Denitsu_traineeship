

// Create a builder for configuring the web application
var builder = WebApplication.CreateBuilder(args);

// Configure CORS (Cross-Origin Resource Sharing) to allow requests from specific origins
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        policy =>
        {
            // Allow requests from the React app's URL
            policy.WithOrigins("http://localhost:3000") // React app URL
                  .AllowAnyHeader() // Allow any headers in requests
                  .AllowAnyMethod(); // Allow any HTTP method (GET, POST, etc.)
        });
});

// Build the web application
var app = builder.Build();

// Use the CORS policy defined above
app.UseCors("AllowSpecificOrigin");

// Define the endpoint to calculate the maximum budget for a specific ad (X6)
app.MapPost("/api/AdBudget/calculate", (BudgetRequest request) =>
{
    // Log the request for debugging purposes
    Console.Write(request);

    // Check if there are at least 4 ad budgets provided
    if (request.OtherAdBudgets.Length < 4)
    {
        return Results.BadRequest("At least 4 ad budgets are required.");
    }

    // Calculate the maximum budget for the specific ad
    double maxAdBudget = CalculateMaximumAdBudget(
        request.TotalBudget, // Total approved budget
        request.FixedCosts, // Fixed costs for agency hours
        request.AgencyFeePercentage, // Agency fee percentage
        request.ThirdPartyFeePercentage, // Third-party tool fee percentage
        request.OtherAdBudgets // Array of ad budgets for other ads
    );

    // Return the result as a successful response
    return Results.Ok(maxAdBudget);
});

// Define a simple GET endpoint to check the API status
app.MapGet("/", () => "Hello World!");

// Run the web application
app.Run();

// Define the calculation logic for determining the maximum budget for a specific ad (X6)
static double CalculateMaximumAdBudget(double Z, double hours, double y1, double y2, double[] otherAdsBudgets)
{
    // Calculate the sum of all provided ad budgets
    double sumOfOtherAds = otherAdsBudgets.Sum();
    
    double maxAdBudget = 0.0;
    
    // Sum of the first, second, and fourth elements of the other ad budgets array
    double sum = otherAdsBudgets[0] + otherAdsBudgets[1] + otherAdsBudgets[3];
    
    // Tolerance level for the goal seek algorithm to determine when to stop
    double tolerance = 0.01;

    // Initialize the bounds for the binary search algorithm
    double lowerBound = 0;
    double upperBound = Z;

    // Perform binary search to find the maximum budget
    while (upperBound - lowerBound > tolerance)
    {
        maxAdBudget = (lowerBound + upperBound) / 2.0;

        // Calculate the total ad spend including the specific ad budget
        double totalAdSpend = maxAdBudget + sumOfOtherAds;
        // Calculate the total budget considering fees and fixed costs
        double totalBudget = totalAdSpend + y1 * totalAdSpend + y2 * sum + hours;

        // Adjust bounds based on whether the total budget exceeds the approved budget
        if (totalBudget > Z)
        {
            upperBound = maxAdBudget;
        }
        else
        {
            lowerBound = maxAdBudget;
        }
    }

    // Return the calculated maximum budget for the specific ad
    return maxAdBudget;
}

// Define the model for the budget request
record BudgetRequest
{
    public double TotalBudget { get; init; } // Total approved budget
    public double FixedCosts { get; init; } // Fixed costs for agency hours
    public double AgencyFeePercentage { get; init; } // Agency fee percentage
    public double ThirdPartyFeePercentage { get; init; } // Third-party tool fee percentage
    public required double[] OtherAdBudgets { get; init; } // Array of ad budgets for other ads
};
