# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a standalone Canadian Housing Affordability Tool - a single-file React application that calculates housing affordability metrics for major Canadian cities (Toronto, Vancouver, Edmonton). The application uses CDN-based React without any build process.

## Architecture

The project consists of a single `index.html` file containing:
- **Data Layer**: Static city data with Q1-2025 housing prices, median/average incomes, utilities, property tax rates, and subsistence costs
- **Business Logic**: Mortgage payment calculations and affordability scoring algorithm
- **UI Layer**: React functional component with hooks for state management
- **Styling**: Inline CSS for simple, clean presentation

Key data sources are documented with inline comments referencing Teranet-NBC HPI, StatCan, Numbeo, and living wage calculations.

## Development Commands

This project requires no build process or dependencies. Development workflow:

```bash
# Serve the file locally (any method)
python3 -m http.server 8000
# or
npx serve .
# or simply open index.html in a browser
```

## Core Components

- **cityData**: Contains all financial data for each city (housing prices, incomes, tax rates, utilities)
- **professions**: Sample profession-based income data
- **mortgagePayment()**: Standard mortgage payment calculation function
- **App component**: Main React component handling all UI state and calculations
- **Affordability algorithm**: Scores based on residual income after housing costs vs. subsistence needs

## Key Calculations

- Down payment: Fixed at 10% (minimum CMHC requirement)
- Net income: Estimated at 75% of gross (simplified tax calculation)
- Affordability score: 0-100 scale based on residual income relative to subsistence costs
- Housing costs: Principal & Interest + utilities + property tax + maintenance

The scoring algorithm:
- Score 100: Residual income ≥ 1.5× subsistence
- Score 0-99: Linear scale between subsistence and 1.5× subsistence
- Score 0: Residual income < subsistence