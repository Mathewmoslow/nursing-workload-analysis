# Nursing Workload Analysis

A React application that implements three statistical models to analyze nursing program workload:
1. Normal Distribution Analysis
2. Categorical Archetype Analysis  
3. Monte Carlo Simulation

## Features

- Upload CSV data files or use sample data
- Adjustable parameters via UI controls
- Three distinct statistical models
- Convergence analysis across models
- Export results as JSON
- Responsive design using Tachyons CSS

## Installation

```bash
npm install
```

## Development

```bash
npm start
```

## Deployment

```bash
npm run deploy
```

## Data Format

The application expects a CSV file with the following columns:
- UniqueID
- Course
- Date
- Item
- Type
- Duration_Cleaned

## Parameters

All parameters are stored in `public/parameters/parameters.json` and can be modified without rebuilding the application.

## License

MIT
