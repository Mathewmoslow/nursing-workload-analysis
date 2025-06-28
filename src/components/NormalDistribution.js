import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import * as jStat from 'jstat';

function NormalDistribution({ data, parameters }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const mean = data.weeklyHours;
    const sd = mean * data.cv;
    
    const pExceedAvailable = 1 - jStat.normal.cdf(parameters.constants.availableTime, mean, sd);
    const pExceedFederal = 1 - jStat.normal.cdf(parameters.constants.federalLimit, mean, sd);

    // Generate distribution data
    const xValues = [];
    const yValues = [];
    for (let x = 20; x <= 100; x += 1) {
      xValues.push(x);
      const z = (x - mean) / sd;
      const y = (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
      yValues.push(y * 1000);
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: xValues,
        datasets: [{
          label: 'Normal Distribution',
          data: yValues,
          borderColor: '#357EDD',
          backgroundColor: 'rgba(53, 126, 221, 0.1)',
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Normal Distribution of Weekly Hours'
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, parameters]);

  const mean = data.weeklyHours;
  const sd = mean * data.cv;
  const pExceedAvailable = 1 - jStat.normal.cdf(parameters.constants.availableTime, mean, sd);
  const pExceedFederal = 1 - jStat.normal.cdf(parameters.constants.federalLimit, mean, sd);

  return (
    <div className="bg-white br3 pa4 shadow-1">
      <h2 className="f3 fw6 dark-blue mt0 mb3">Model 1: Normal Distribution Analysis</h2>
      
      <div className="bg-light-blue br2 pa3 mb3">
        <p className="f5 mb2"><strong>Mean:</strong> {mean.toFixed(1)} hours/week</p>
        <p className="f5 mb2"><strong>Standard Deviation:</strong> {sd.toFixed(1)} hours</p>
        <p className="f5 mb0"><strong>CV:</strong> {data.cv.toFixed(3)}</p>
      </div>

      <div className="bg-light-red br2 pa3 mb3">
        <p className="f5 fw6 dark-red mb2">
          {(pExceedAvailable * 100).toFixed(1)}% exceed available time
        </p>
        <p className="f5 fw6 dark-red mb0">
          {(pExceedFederal * 100).toFixed(1)}% exceed federal limit
        </p>
      </div>

      <div style={{ height: '400px' }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}

export default NormalDistribution;
