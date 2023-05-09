import React, { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  Title,
  ChartData,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  Title,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
);

export default function App() {
  const [workbookData, setWorkbookData] = useState([]);
  const [workbookPath, setWorkbookPath] = useState("");
  
  // const [chartData, setChartData] = useState();
  const [chartData, setChartData] = useState<ChartData<"bar">>();
  const [chartOptions, setChartOptions] = useState({
    indexAxis: 'y' as const,
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

  useEffect(() => {
    processChartData();
  }, [workbookData]);

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

    } catch (e) {
      console.log(e);
    }
  }

  function processChartData() {
    try {
      const labels = [
        'Governor',
        'Vice Governor',
        'Secretary',
        'Treasurer',
        'Auditor',
        'PRO',
      ];
      const workbookColumns = [
        'Select a Governor',
        'Select a Vice Governor',
        'Select a Secretary',
        'Select a Treasurer',
        'Select an Auditor',
        'Select a Press Relation Officer (P.R.O.)',
      ];
      const workbookColumnsOutput = [
        'Governor',
        'Vice Governor',
        'Secretary',
        'Treasurer',
        'Auditor',
        'P.R.O.',
      ];

      const semicolonPartyLabels = [
        'DASIG, John Westen Rey (Semicolon Party)',
        'BADON, Raven Vera (Semicolon Party)',
        'ALTONAGA, John Stanley (Semicolon Party)',
        'PEREZ, Greleen (Semicolon Party)',
        'MALTO, Lanz Alexander (Semicolon Party)',
        'JUGAR, Pete Aejosh (Semicolon)',
      ];
      const signalPartyLabels = [
        'GAUDAN, Gianne Guenter (Signal Party)',
        'JALANDONI, Jea Katrina (Signal Party)',
        'TE, Alexandra Margaret (Signal Party)',
        'OLICIA, Samantha Kyle (Signal Party)',
        'DE JESUS, Giancarlo (Signal Party)',
        'PATALAN, Jozua Fabillar (Signal Party)',
      ];

      const filteredColumns = workbookColumns.map((value) => (
        (workbookData.map((dataValue) => dataValue[value]))
      ));

      const semicolonPartyTotals = filteredColumns.map((value, index) => (
        value.reduce((acc, curr) => (
          (curr === semicolonPartyLabels[index]) ? ++acc : acc
        ), 0)
      ));
      const signalPartyTotals = filteredColumns.map((value, index) => (
        value.reduce((acc, curr) => (
          (curr === signalPartyLabels[index]) ? ++acc : acc
        ), 0)
      ));

      setChartData({
        labels,
        datasets: [
          {
            label: 'Semicolon',
            data: semicolonPartyTotals,
            backgroundColor: 'rgb(128, 0, 0)'
          },
          {
            label: 'Signal',
            data: signalPartyTotals,
            backgroundColor: 'rgb(0, 0, 128)'
          }
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
    {chartData && (
      <div className="sheet-results-container">
        <Bar
          data={chartData}
          options={chartOptions}
        />
      </div>
    )}
  </>
}
