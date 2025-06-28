import React from 'react';

function ParameterControls({ params, onChange }) {
  const handleChange = (param, value) => {
    onChange({
      ...params,
      [param]: parseFloat(value)
    });
  };

  return (
    <div className="bg-white br3 pa4 mb4 shadow-1">
      <h2 className="f3 fw6 dark-blue mt0 mb3">Adjustable Parameters</h2>
      
      <div className="flex flex-column flex-row-ns justify-between">
        <div className="mb3 mb0-ns">
          <label className="db fw6 lh-copy f6 mb2">
            Reading Hours: {params.readingHours.toFixed(1)}
          </label>
          <input
            type="range"
            min="1.0"
            max="2.0"
            step="0.1"
            value={params.readingHours}
            onChange={(e) => handleChange('readingHours', e.target.value)}
            className="w5"
          />
        </div>

        <div className="mb3 mb0-ns">
          <label className="db fw6 lh-copy f6 mb2">
            Assignment Hours: {params.assignmentHours.toFixed(1)}
          </label>
          <input
            type="range"
            min="1.5"
            max="3.0"
            step="0.1"
            value={params.assignmentHours}
            onChange={(e) => handleChange('assignmentHours', e.target.value)}
            className="w5"
          />
        </div>

        <div>
          <label className="db fw6 lh-copy f6 mb2">
            Coefficient of Variation: {params.cv.toFixed(3)}
          </label>
          <input
            type="range"
            min="0.15"
            max="0.25"
            step="0.01"
            value={params.cv}
            onChange={(e) => handleChange('cv', e.target.value)}
            className="w5"
          />
        </div>
      </div>

      <div className="mt3">
        <button
          onClick={() => window.location.reload()}
          className="f6 link dim br2 ph3 pv2 dib white bg-gray bn pointer mr2"
        >
          Reset
        </button>
        <button
          onClick={() => {
            const results = {
              timestamp: new Date().toISOString(),
              parameters: params
            };
            const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `parameters-${results.timestamp}.json`;
            a.click();
          }}
          className="f6 link dim br2 ph3 pv2 dib white bg-green bn pointer"
        >
          Export Parameters
        </button>
      </div>
    </div>
  );
}

export default ParameterControls;
