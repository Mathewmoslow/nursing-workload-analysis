import React, { useState, useEffect } from 'react';
import 'tachyons';
import DataLoader from './components/DataLoader';
import ParameterControls from './components/ParameterControls';
import DataOverview from './components/DataOverview';
import NormalDistribution from './components/NormalDistribution';
import ArchetypeAnalysis from './components/ArchetypeAnalysis';
import MonteCarloSimulation from './components/MonteCarloSimulation';
import ConvergenceAnalysis from './components/ConvergenceAnalysis';
import { processData } from './utils/dataProcessor';

function App() {
  const [data, setData] = useState([]);
  const [parameters, setParameters] = useState(null);
  const [processedData, setProcessedData] = useState(null);
  const [adjustableParams, setAdjustableParams] = useState({
    readingHours: 1.5,
    assignmentHours: 2.0,
    cv: 0.192
  });

  useEffect(() => {
    // Load parameters on mount
    fetch('/parameters/parameters.json')
      .then(res => res.json())
      .then(params => setParameters(params))
      .catch(err => console.error('Error loading parameters:', err));
  }, []);

  useEffect(() => {
    if (data.length > 0 && parameters) {
      const processed = processData(data, parameters, adjustableParams);
      setProcessedData(processed);
    }
  }, [data, parameters, adjustableParams]);

  const handleDataLoad = (loadedData) => {
    setData(loadedData);
  };

  const handleParamChange = (newParams) => {
    setAdjustableParams(newParams);
  };

  return (
    <div className="sans-serif bg-light-gray min-vh-100">
      <div className="mw8 center pa4">
        <header className="tc mb4">
          <h1 className="f1 fw9 dark-blue mt0 mb2">Nursing Workload Analysis</h1>
          <p className="f4 gray">Three Statistical Models for Program Evaluation</p>
        </header>

        <DataLoader onDataLoad={handleDataLoad} />

        {data.length > 0 && processedData && (
          <>
            <ParameterControls 
              params={adjustableParams}
              onChange={handleParamChange}
            />

            <DataOverview data={processedData} />

            <div className="mt4">
              <NormalDistribution 
                data={processedData}
                parameters={parameters}
              />
            </div>

            <div className="mt4">
              <ArchetypeAnalysis 
                data={processedData}
                parameters={parameters}
              />
            </div>

            <div className="mt4">
              <MonteCarloSimulation 
                data={processedData}
                parameters={parameters}
              />
            </div>

            <div className="mt4">
              <ConvergenceAnalysis 
                normalData={processedData}
                archetypeData={processedData}
                monteCarloData={processedData}
                parameters={parameters}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
