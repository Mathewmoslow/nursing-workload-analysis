// src/components/ArchetypeAnalysis.js
import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { processArchetypeData } from '../utils/archetypeProcessor';

function ArchetypeAnalysis({ data, parameters }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const results = processArchetypeData(data, parameters);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(results),
        datasets: [{
          label: 'Weekly Hours',
          data: Object.values(results).map(r => r.weeklyHours),
          backgroundColor: Object.values(results).map(r => 
            !r.feasible ? '#E53E3E' : r.exceedsFederal ? '#F6AD55' : '#48BB78'
          )
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Weekly Hours by Student Archetype'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Hours per Week'
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [results]);

  const totalInfeasible = Object.values(results)
    .filter(r => !r.feasible)
    .reduce((sum, r) => sum + r.population, 0) * 100;

  return (
    <div className="bg-white br3 pa4 shadow-1">
      <h2 className="f3 fw6 dark-blue mt0 mb3">Model 2: Categorical Archetype Analysis</h2>
      
      <div className="overflow-auto mb3">
        <table className="f6 w-100 mw8 center">
          <thead>
            <tr className="stripe-dark">
              <th className="fw6 tl pa3 bg-black-10">Archetype</th>
              <th className="fw6 tc pa3 bg-black-10">Population %</th>
              <th className="fw6 tc pa3 bg-black-10">Weekly Hours</th>
              <th className="fw6 tc pa3 bg-black-10">Deficit/Surplus</th>
              <th className="fw6 tc pa3 bg-black-10">Status</th>
            </tr>
          </thead>
          <tbody className="lh-copy">
            {Object.entries(results).map(([name, result]) => (
              <tr key={name} className="stripe-dark">
                <td className="pa3">{name}</td>
                <td className="pa3 tc">{(result.population * 100).toFixed(0)}%</td>
                <td className="pa3 tc">{result.weeklyHours.toFixed(1)}</td>
                <td className={`pa3 tc fw6 ${result.deficit > 0 ? 'dark-red' : 'dark-green'}`}>
                  {result.deficit > 0 ? '+' : ''}{result.deficit.toFixed(1)}
                </td>
                <td className={`pa3 tc fw6 ${
                  !result.feasible ? 'dark-red' : 
                  result.exceedsFederal ? 'orange' : 'dark-green'
                }`}>
                  {!result.feasible ? 'Not Feasible' : 
                   result.exceedsFederal ? 'Exceeds Federal' : 'Feasible'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-light-red br2 pa3 mb3">
        <p className="f5 fw6 dark-red mb0">
          {totalInfeasible.toFixed(1)}% of students face impossible time demands
        </p>
      </div>

      <div style={{ height: '400px' }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}

export default ArchetypeAnalysis;