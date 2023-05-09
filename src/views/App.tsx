import React, { useState } from 'react'
import {
  Chart as ChartJS,
  Title,
  ChartData,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  Title,
);

export default function App() {
  const [workbookData, setWorkbookData] = useState([]);
  const [workbookPath, setWorkbookPath] = useState("");
  const [testText, setTestText] = useState("");
  
  const [chartData, setChartData] = useState<ChartData>();
  const [chartOptions, setChartOptions] = useState({
    plugins: {
      title: {
        display: true,
        text: 'Results',
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  });

  async function workbookReadHandler() {
    try {
      const [data, path] = await (window as any).api.openFile();
      setWorkbookData(data);
      setWorkbookPath(path);
    } catch (e) {
      console.log(e);
    }
  }

  async function workbookRefreshHandler() {
    try {
      const data = await (window as any).api.refreshWorkbook(workbookPath);
      setWorkbookData(data);

      console.log(data);
    } catch (e) {
      console.log(e);
    }
  }

  function processChartData() {
    try {
      const labels = ['1', '2', '3'];

      setChartData({
        labels,
        datasets: [
          // Fill in data sets based on party here
          // See: https://codesandbox.io/s/github/reactchartjs/react-chartjs-2/tree/master/sandboxes/bar/stacked?from-embed=&file=/App.tsx
        ],
      });
    } catch (e) {
      console.log(e);
    }
  }

  return <>
    <h1>Results</h1>
    <div className="button-container">
      <button
        onClick={workbookReadHandler}
      >
        Read Workbook
      </button>
    </div>
    {workbookPath && (
      <div className="refresh-container">
        <button
          onClick={workbookRefreshHandler}
        >
          Refresh
        </button>
      </div>
    )}
    {workbookData && (
      <div className="sheet-results-container">
        <Bar
          data
        >

        </Bar>

      </div>
    )}
    {/* <div className="">
      <input type="text" onChange={(e) => setTestText(e.target.value)} />
      <input 
        type="submit" 
        value="Submit" 
        onClick={async (e) => {
          e.preventDefault();
          console.log(await (window as any).api.testFunction(testText));
        }}
      />
    </div> */}
  </>
}
