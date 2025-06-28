import React from 'react';

function DataOverview({ data }) {
  return (
    <div className="bg-white br3 pa4 mb4 shadow-1">
      <h2 className="f3 fw6 dark-blue mt0 mb3">Program Overview</h2>
      
      <div className="flex flex-wrap">
        <div className="w-100 w-third-ns pa2">
          <div className="bg-light-blue br2 pa3">
            <h3 className="f5 fw6 dark-blue mt0 mb2">Total Program Hours</h3>
            <p className="f6 mb1">Known: {data.knownHours.toFixed(1)} hours</p>
            <p className="f6 mb1">Estimated: {data.estimatedHours.toFixed(1)} hours</p>
            <p className="f4 fw6 mb0">Total: {data.totalHours.toFixed(1)} hours</p>
          </div>
        </div>

        <div className="w-100 w-third-ns pa2">
          <div className="bg-light-green br2 pa3">
            <h3 className="f5 fw6 dark-green mt0 mb2">Weekly Averages</h3>
            <p className="f6 mb1">Mean: {data.weeklyHours.toFixed(1)} hours/week</p>
            <p className="f6 mb1">Fixed: {(data.fixedHours / 14).toFixed(1)} hours/week</p>
            <p className="f6 mb0">Variable: {(data.variableHours / 14).toFixed(1)} hours/week</p>
          </div>
        </div>

        <div className="w-100 w-third-ns pa2">
          <div className="bg-light-yellow br2 pa3">
            <h3 className="f5 fw6 dark-red mt0 mb2">Key Limits</h3>
            <p className="f6 mb1">Available time: 63.3 hours/week</p>
            <p className="f6 mb1">Federal limit: 39 hours/week</p>
            <p className="f6 mb0">Program: 14 weeks</p>
          </div>
        </div>
      </div>

      <div className="mt4">
        <h3 className="f4 fw6 dark-blue mb3">Task Distribution</h3>
        <table className="collapse ba br2 b--black-10 pv2 ph3 w-100">
          <thead>
            <tr className="striped--light-gray">
              <th className="pv2 ph3 tl f6 fw6 ttu">Task Type</th>
              <th className="pv2 ph3 tr f6 fw6 ttu">Count</th>
              <th className="pv2 ph3 tr f6 fw6 ttu">Hours</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data.tasksByType)
              .sort((a, b) => b[1].hours - a[1].hours)
              .map(([type, info]) => (
                <tr key={type} className="striped--light-gray">
                  <td className="pv2 ph3">{type}</td>
                  <td className="pv2 ph3 tr">{info.count}</td>
                  <td className="pv2 ph3 tr">{info.hours.toFixed(1)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataOverview;
