// Constants
var G = 6.67430e-11; // Gravitational constant in m^3 kg^-1 s^-2
var solarMass = 1.989e30; // Solar mass in kg

// Function to calculate the orbital period
function Calculate() {
    // Read input values from HTML elements
    var semiMajorAxisAU = parseFloat(document.getElementById('semiMajorAxis').value);
    var mass = parseFloat(document.getElementById('mass').value);

    // Convert semi-major axis from AU to meters
    var semiMajorAxisMeters = semiMajorAxisAU * 1.496e11; 

    // Calculate orbital period squared using Kepler's Third Law equation
    var orbitalPeriodSquared = (4 * Math.pow(Math.PI, 2) * Math.pow(semiMajorAxisMeters, 3)) / (G * mass * solarMass);

    var orbitalPeriodInSeconds = Math.sqrt(orbitalPeriodSquared);

    // Constants for time conversion
    var secondsInADay = 24 * 60 * 60; 
    var secondsInAYear = 365 * secondsInADay; 

    // Calculate orbital period in years and leftover days
    var orbitalPeriodInYears = orbitalPeriodInSeconds / secondsInAYear;
    var orbitalPeriodLeftoverDays = (orbitalPeriodInSeconds % secondsInAYear) / secondsInADay;

    // Display the result in HTML
    document.getElementById('result').textContent = "Orbital Period: " + Math.floor(orbitalPeriodInYears) + " year(s) and " + orbitalPeriodLeftoverDays.toFixed(2) + " day(s)";
}

// Attach the Calculate function to a button click event
document.getElementById('calculate').addEventListener('click', Calculate);
