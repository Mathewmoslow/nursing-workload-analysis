// src/components/MonteCarloSimulation.js
import React, { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js/auto';
import { runMonteCarloSimulation } from '../utils/monteCarloSimulator';

function MonteCarloSimulation({ data, parameters }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [results, setResults] = useState(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    runSimulation();
  }, [data, parameters]);

  const runSimulation = async () => {
    setRunning(true);
    const simResults = await runMonteCarloSimulation(data, parameters, 1000);
    setResults(simResults);
    setRunning(false);
  };

  useEffect(() => {
    if (!results) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create histogram
    const binSize = 5;
    const minVal = 30;
    const maxVal = 100;
    const bins = [];
    const regularCounts = [];
    const peakCounts = [];

    for (let i = minVal; i < maxVal; i += binSize) {
      bins.push(`${i}-${i + binSize}`);
      regularCounts.push(results.regular.filter(v => v >= i && v < i + binSize).length);
      peakCounts.push(results.peak.filter(v => v >= i && v < i + binSize).length);
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: bins,
        datasets: [{
          label: 'Regular Week',
          data: regularCounts,
          backgroundColor: 'rgba(53, 126, 221, 0.7)'
        }, {
          label: 'Peak Week (Finals)',
          data: peakCounts,
          backgroundColor: 'rgba(229, 62, 62, 0.7)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Distribution of Weekly Hours (1000 simulations)'
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Hours per Week'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Frequency'
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

  if (running || !results) {
    return (
      <div className="bg-white br3 pa4 shadow-1 tc">
        <h2 className="f3 fw6 dark-blue mt0 mb3">Model 3: Monte Carlo Simulation</h2>
        <p className="f5 gray i">Running simulation...</p>
      </div>
    );
  }

  return (
    <div className="bg-white br3 pa4 shadow-1">
      <h2 className="f3 fw6 dark-blue mt0 mb3">Model 3: Monte Carlo Simulation</h2>
      
      <div className="flex flex-wrap mb3">
        <div className="w-100 w-50-ns pr2-ns">
          <div className="bg-light-blue br2 pa3">
            <h3 className="f5 fw6 dark-blue mt0 mb2">Regular Week</h3>
            <p className="f6 mb1">Mean: {results.stats.regular.mean.toFixed(1)} hours</p>
            <p className="f6 mb1">5th percentile: {results.stats.regular.p5.toFixed(1)} hours</p>
            <p className="f6 mb1">95th percentile: {results.stats.regular.p95.toFixed(1)} hours</p>
            <p className="f5 fw6 dark-red mb0">
              {(results.stats.regular.exceedsAvailable * 100).toFixed(1)}% exceed available time
            </p>
          </div>
        </div>
        
        <div className="w-100 w-50-ns pl2-ns mt3 mt0-ns">
          <div className="bg-light-yellow br2 pa3">
            <h3 className="f5 fw6 dark-red mt0 mb2">Peak Week (Finals)</h3>
            <p className="f6 mb1">Mean: {results.stats.peak.mean.toFixed(1)} hours</p>
            <p className="f6 mb1">5th percentile: {results.stats.peak.p5.toFixed(1)} hours</p>
            <p className="f6 mb1">95th percentile: {results.stats.peak.p95.toFixed(1)} hours</p>
            <p className="f5 fw6 dark-red mb0">
              {(results.stats.peak.exceedsAvailable * 100).toFixed(1)}% exceed available time
            </p>
          </div>
        </div>
      </div>

      <div style={{ height: '400px' }}>
        <canvas ref={chartRef}></canvas>
      </div>

      <div className="mt3">
        <button
          onClick={runSimulation}
          className="f6 link dim br2 ph3 pv2 dib white bg-blue bn pointer"
        >
          Re-run Simulation
        </button>
      </div>
    </div>
  );
}

export default MonteCarloSimulation;