// src/utils/monteCarloSimulator.js
import { parseDuration } from './dataProcessor';

export async function runMonteCarloSimulation(data, parameters, iterations = 1000) {
  const results = {
    regular: [],
    peak: [],
    byArchetype: {}
  };
  
  // Initialize archetype tracking
  Object.values(parameters.archetypes).forEach(arch => {
    results.byArchetype[arch.name] = {
      regular: [],
      peak: []
    };
  });
  
  for (let i = 0; i < iterations; i++) {
    // Randomly assign archetype based on population distribution
    const rand = Math.random();
    let cumulative = 0;
    let selectedArchetype = null;
    
    for (const [key, archetype] of Object.entries(parameters.archetypes)) {
      cumulative += archetype.populationPct;
      if (rand < cumulative) {
        selectedArchetype = archetype;
        break;
      }
    }
    
    // Add individual variation
    const individualVariation = 1 + (Math.random() - 0.5) * 0.1; // ±5%
    
    // Calculate hours
    let totalHours = 0;
    data.rawData.forEach(row => {
      let duration = parseDuration(row.Duration_Cleaned);
      
      if (duration === null && parameters.durationEstimates[row.Type] !== undefined) {
        duration = parameters.durationEstimates[row.Type];
      }
      
      if (duration) {
        if (parameters.fixedTaskTypes.includes(row.Type)) {
          totalHours += duration;
        } else {
          const multiplier = (selectedArchetype.multipliers[row.Type] || 1.0) * individualVariation;
          totalHours += duration * multiplier;
        }
      }
    });
    
    const baseWeeklyHours = totalHours / parameters.constants.weeks;
    const regularWeekHours = baseWeeklyHours * parameters.weeklyIntensity[6]; // Week 7
    const peakWeekHours = baseWeeklyHours * parameters.weeklyIntensity[12]; // Week 13
    
    results.regular.push(regularWeekHours);
    results.peak.push(peakWeekHours);
    results.byArchetype[selectedArchetype.name].regular.push(regularWeekHours);
    results.byArchetype[selectedArchetype.name].peak.push(peakWeekHours);
  }
  
  // Calculate statistics
  const getStats = (arr) => {
    const sorted = arr.sort((a, b) => a - b);
    return {
      mean: arr.reduce((sum, x) => sum + x, 0) / arr.length,
      p5: sorted[Math.floor(arr.length * 0.05)],
      p25: sorted[Math.floor(arr.length * 0.25)],
      p50: sorted[Math.floor(arr.length * 0.50)],
      p75: sorted[Math.floor(arr.length * 0.75)],
      p95: sorted[Math.floor(arr.length * 0.95)],
      exceedsAvailable: arr.filter(x => x > parameters.constants.availableTime).length / arr.length,
      exceedsFederal: arr.filter(x => x > parameters.constants.federalLimit).length / arr.length
    };
  };
  
  return {
    regular: results.regular,
    peak: results.peak,
    stats: {
      regular: getStats(results.regular),
      peak: getStats(results.peak)
    },
    byArchetype: results.byArchetype
  };
}