/* Canadian Housing Affordability Tool - Data Layer */

// Initialize global data namespace
window.HousingData = window.HousingData || {};

// City data with Q1-2025 housing prices and financial metrics
window.HousingData.cityData = {
  "Toronto": { 
    prices: {
      "Studio/1 Bedroom Condo": 650000,
      "2 Bedroom Condo": 850000,
      "3 Bedroom Condo": 1100000,
      "1 Bedroom + Den Condo": 750000,
      "Townhouse (2-3 BR)": 950000,
      "Detached House (3+ BR)": 1400000,
      "Semi-Detached House": 1100000,
      "Average Property": 1184646
    },
    medianIncome: 98063, averageIncome: 105000, utilities: 327.83, propertyTaxRate: 0.00715289, maintenanceRate: 0.01, subsistence: 4600 
  },
  "Vancouver": { 
    prices: {
      "Studio/1 Bedroom Condo": 700000,
      "2 Bedroom Condo": 950000,
      "3 Bedroom Condo": 1200000,
      "1 Bedroom + Den Condo": 800000,
      "Townhouse (2-3 BR)": 1100000,
      "Detached House (3+ BR)": 1800000,
      "Semi-Detached House": 1350000,
      "Average Property": 1299416
    },
    medianIncome: 90061, averageIncome: 98000, utilities: 312.31, propertyTaxRate: 0.00311827, maintenanceRate: 0.01, subsistence: 5000 
  },
  "Edmonton": { 
    prices: {
      "Studio/1 Bedroom Condo": 185000,
      "2 Bedroom Condo": 240000,
      "3 Bedroom Condo": 310000,
      "1 Bedroom + Den Condo": 210000,
      "Townhouse (2-3 BR)": 320000,
      "Detached House (3+ BR)": 450000,
      "Semi-Detached House": 380000,
      "Average Property": 472103
    },
    medianIncome: 101921, averageIncome: 104000, utilities: 442.39, propertyTaxRate: 0.0101391, maintenanceRate: 0.01, subsistence: 4200 
  },
  "Calgary": { 
    prices: {
      "Studio/1 Bedroom Condo": 220000,
      "2 Bedroom Condo": 285000,
      "3 Bedroom Condo": 365000,
      "1 Bedroom + Den Condo": 250000,
      "Townhouse (2-3 BR)": 380000,
      "Detached House (3+ BR)": 520000,
      "Semi-Detached House": 430000,
      "Average Property": 520000
    },
    medianIncome: 105000, averageIncome: 108000, utilities: 435.00, propertyTaxRate: 0.00658, maintenanceRate: 0.01, subsistence: 4200 
  },
  "Montreal": { 
    prices: {
      "Studio/1 Bedroom Condo": 320000,
      "2 Bedroom Condo": 420000,
      "3 Bedroom Condo": 550000,
      "1 Bedroom + Den Condo": 365000,
      "Townhouse (2-3 BR)": 480000,
      "Detached House (3+ BR)": 580000,
      "Semi-Detached House": 520000,
      "Average Property": 485000
    },
    medianIncome: 76000, averageIncome: 82000, utilities: 285.00, propertyTaxRate: 0.00695, maintenanceRate: 0.01, subsistence: 4100 
  },
  "Ottawa": { 
    prices: {
      "Studio/1 Bedroom Condo": 350000,
      "2 Bedroom Condo": 450000,
      "3 Bedroom Condo": 580000,
      "1 Bedroom + Den Condo": 395000,
      "Townhouse (2-3 BR)": 520000,
      "Detached House (3+ BR)": 750000,
      "Semi-Detached House": 620000,
      "Average Property": 650000
    },
    medianIncome: 95000, averageIncome: 102000, utilities: 310.00, propertyTaxRate: 0.01236, maintenanceRate: 0.01, subsistence: 4400 
  },
  "Quebec City": { 
    prices: {
      "Studio/1 Bedroom Condo": 180000,
      "2 Bedroom Condo": 230000,
      "3 Bedroom Condo": 290000,
      "1 Bedroom + Den Condo": 205000,
      "Townhouse (2-3 BR)": 280000,
      "Detached House (3+ BR)": 380000,
      "Semi-Detached House": 320000,
      "Average Property": 320000
    },
    medianIncome: 68000, averageIncome: 74000, utilities: 275.00, propertyTaxRate: 0.00812, maintenanceRate: 0.01, subsistence: 3900 
  },
  "Winnipeg": { 
    prices: {
      "Studio/1 Bedroom Condo": 160000,
      "2 Bedroom Condo": 210000,
      "3 Bedroom Condo": 270000,
      "1 Bedroom + Den Condo": 185000,
      "Townhouse (2-3 BR)": 290000,
      "Detached House (3+ BR)": 420000,
      "Semi-Detached House": 350000,
      "Average Property": 385000
    },
    medianIncome: 78000, averageIncome: 84000, utilities: 380.00, propertyTaxRate: 0.02285, maintenanceRate: 0.01, subsistence: 3800 
  },
  "Halifax": { 
    prices: {
      "Studio/1 Bedroom Condo": 280000,
      "2 Bedroom Condo": 360000,
      "3 Bedroom Condo": 450000,
      "1 Bedroom + Den Condo": 315000,
      "Townhouse (2-3 BR)": 420000,
      "Detached House (3+ BR)": 580000,
      "Semi-Detached House": 480000,
      "Average Property": 485000
    },
    medianIncome: 75000, averageIncome: 81000, utilities: 420.00, propertyTaxRate: 0.01089, maintenanceRate: 0.01, subsistence: 4000 
  },
  "Regina": { 
    prices: {
      "Studio/1 Bedroom Condo": 140000,
      "2 Bedroom Condo": 180000,
      "3 Bedroom Condo": 230000,
      "1 Bedroom + Den Condo": 160000,
      "Townhouse (2-3 BR)": 240000,
      "Detached House (3+ BR)": 350000,
      "Semi-Detached House": 280000,
      "Average Property": 295000
    },
    medianIncome: 79000, averageIncome: 85000, utilities: 385.00, propertyTaxRate: 0.01398, maintenanceRate: 0.01, subsistence: 3600 
  }
};

window.HousingData.professions = {
  "Software Engineer": 115000, "Data Scientist": 108000, "Product Manager": 125000,
  "Registered Nurse": 82000, "Teacher": 75000, "Police Officer": 78000,
  "Accountant": 72000, "Financial Analyst": 85000, "Marketing Manager": 88000,
  "Pharmacist": 98000, "Dentist": 165000, "Doctor": 285000, "Lawyer": 145000
};