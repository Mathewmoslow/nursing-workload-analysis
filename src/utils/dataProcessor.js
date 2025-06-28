export function parseDuration(durationStr) {
  if (!durationStr || durationStr === 'N/A' || durationStr === '') return null;
  
  const strDur = String(durationStr);
  if (strDur.includes(':')) {
    const parts = strDur.split(':');
    const hours = parseInt(parts[0]) || 0;
    const minutes = parseInt(parts[1]) || 0;
    const seconds = parts[2] ? parseInt(parts[2]) : 0;
    return hours + minutes/60 + seconds/3600;
  }
  
  const num = parseFloat(strDur);
  if (!isNaN(num)) return num;
  
  return null;
}

export function processData(data, parameters, adjustableParams) {
  const durationEstimates = {
    ...parameters.durationEstimates,
    Reading: adjustableParams.readingHours,
    Assignment: adjustableParams.assignmentHours
  };

  let totalHours = 0;
  let knownHours = 0;
  let estimatedHours = 0;
  let fixedHours = 0;
  let variableHours = 0;

  const tasksByType = {};
  const tasksByCourse = {};

  data.forEach(row => {
    let duration = parseDuration(row.Duration_Cleaned);
    
    if (duration === null && durationEstimates[row.Type] !== undefined) {
      duration = durationEstimates[row.Type];
      estimatedHours += duration;
    } else if (duration !== null) {
      knownHours += duration;
    }
    
    if (duration) {
      totalHours += duration;
      
      if (parameters.fixedTaskTypes.includes(row.Type)) {
        fixedHours += duration;
      } else {
        variableHours += duration;
      }
    }

    // Group by type
    if (!tasksByType[row.Type]) {
      tasksByType[row.Type] = { count: 0, hours: 0 };
    }
    tasksByType[row.Type].count++;
    if (duration) tasksByType[row.Type].hours += duration;

    // Group by course
    if (!tasksByCourse[row.Course]) {
      tasksByCourse[row.Course] = { count: 0, hours: 0 };
    }
    tasksByCourse[row.Course].count++;
    if (duration) tasksByCourse[row.Course].hours += duration;
  });

  return {
    totalHours,
    knownHours,
    estimatedHours,
    fixedHours,
    variableHours,
    weeklyHours: totalHours / parameters.constants.weeks,
    tasksByType,
    tasksByCourse,
    cv: adjustableParams.cv,
    rawData: data
  };
}
