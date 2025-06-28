import React, { useState } from 'react';
import Papa from 'papaparse';

function DataLoader({ onDataLoad }) {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      setFileName(file.name);

      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          const validData = results.data.filter(row => row.Type);
          onDataLoad(validData);
          setLoading(false);
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          setLoading(false);
        }
      });
    }
  };

  const loadSampleData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.PUBLIC_URL}/data/Cleaned_Master.csv`);
      const text = await response.text();
      
      Papa.parse(text, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          const validData = results.data.filter(row => row.Type);
          onDataLoad(validData);
          setFileName('Cleaned_Master.csv');
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('Error loading sample data:', error);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white br3 pa4 mb4 shadow-1">
      <h2 className="f3 fw6 dark-blue mt0 mb3">Data Input</h2>
      
      <div className="flex flex-column flex-row-ns items-center">
        <div className="mb3 mb0-ns mr3-ns">
          <label className="db fw6 lh-copy f6 mb2" htmlFor="file-upload">
            Upload CSV File:
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="input-reset ba b--black-20 pa2 mb2 db w-100"
          />
        </div>
        
        <div className="tc">
          <span className="f5 gray mh3">OR</span>
        </div>
        
        <div>
          <button
            onClick={loadSampleData}
            className="f6 link dim br2 ph3 pv2 mb2 dib white bg-blue bn pointer"
          >
            Load Sample Data
          </button>
        </div>
      </div>

      {loading && (
        <div className="tc mt3">
          <span className="f5 gray i">Loading data...</span>
        </div>
      )}

      {fileName && !loading && (
        <div className="mt3 pa3 bg-light-green br2">
          <span className="f6 dark-green">
            ✓ Loaded: {fileName}
          </span>
        </div>
      )}
    </div>
  );
}

export default DataLoader;
