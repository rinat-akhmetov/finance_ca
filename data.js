/* Canadian Housing Affordability Tool - Data Layer */

// Initialize global data namespace
window.HousingData = window.HousingData || {};

// City data with Q1-2025 housing prices and financial metrics
window.HousingData.cityData = {
  "Toronto": { price: 1184646, medianIncome: 98063, averageIncome: 105000, utilities: 327.83, propertyTaxRate: 0.00715289, maintenanceRate: 0.01, subsistence: 4600 },
  "Vancouver": { price: 1299416, medianIncome: 90061, averageIncome: 98000, utilities: 312.31, propertyTaxRate: 0.00311827, maintenanceRate: 0.01, subsistence: 5000 },
  "Edmonton": { price: 472103, medianIncome: 101921, averageIncome: 104000, utilities: 442.39, propertyTaxRate: 0.0101391, maintenanceRate: 0.01, subsistence: 4200 },
  "Calgary": { price: 520000, medianIncome: 105000, averageIncome: 108000, utilities: 435.00, propertyTaxRate: 0.00658, maintenanceRate: 0.01, subsistence: 4200 },
  "Montreal": { price: 485000, medianIncome: 76000, averageIncome: 82000, utilities: 285.00, propertyTaxRate: 0.00695, maintenanceRate: 0.01, subsistence: 4100 },
  "Ottawa": { price: 650000, medianIncome: 95000, averageIncome: 102000, utilities: 310.00, propertyTaxRate: 0.01236, maintenanceRate: 0.01, subsistence: 4400 },
  "Quebec City": { price: 320000, medianIncome: 68000, averageIncome: 74000, utilities: 275.00, propertyTaxRate: 0.00812, maintenanceRate: 0.01, subsistence: 3900 },
  "Winnipeg": { price: 385000, medianIncome: 78000, averageIncome: 84000, utilities: 380.00, propertyTaxRate: 0.02285, maintenanceRate: 0.01, subsistence: 3800 },
  "Halifax": { price: 485000, medianIncome: 75000, averageIncome: 81000, utilities: 420.00, propertyTaxRate: 0.01089, maintenanceRate: 0.01, subsistence: 4000 },
  "Regina": { price: 295000, medianIncome: 79000, averageIncome: 85000, utilities: 385.00, propertyTaxRate: 0.01398, maintenanceRate: 0.01, subsistence: 3600 }
};

window.HousingData.professions = {
  "Software Engineer": 115000, "Data Scientist": 108000, "Product Manager": 125000,
  "Registered Nurse": 82000, "Teacher": 75000, "Police Officer": 78000,
  "Accountant": 72000, "Financial Analyst": 85000, "Marketing Manager": 88000,
  "Pharmacist": 98000, "Dentist": 165000, "Doctor": 285000, "Lawyer": 145000
};