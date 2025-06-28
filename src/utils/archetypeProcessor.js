// src/utils/archetypeProcessor.js
import { parseDuration } from './dataProcessor';

export function processArchetypeData(data, parameters) {
  const results = {};
  
  Object.entries(parameters.archetypes).forEach(([key, archetype]) => {
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
          const multiplier = archetype.multipliers[row.Type] || 1.0;
          totalHours += duration * multiplier;
        }
      }
    });
    
    const weeklyHours = totalHours / parameters.constants.weeks;
    const deficit = weeklyHours - parameters.constants.availableTime;
    
    results[archetype.name] = {
      population: archetype.populationPct,
      weeklyHours: weeklyHours,
      deficit: deficit,
      feasible: deficit <= 0,
      exceedsFederal: weeklyHours > parameters.constants.federalLimit
    };
  });
  
  return results;
}