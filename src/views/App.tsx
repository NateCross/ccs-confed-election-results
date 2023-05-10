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
  CategoryScale,
  LinearScale,
  BarElement,
);

// CHANGE ME
const MAX_VOTERS = 10;
const LABELS = [
  'Governor',
  'Vice Governor',
  'Secretary',
  'Treasurer',
  'Auditor',
  'P.R.O.',
];
const WORKBOOK_COLUMNS = [
  'Select a Governor',
  'Select a Vice Governor',
  'Select a Secretary',
  'Select a Treasurer',
  'Select an Auditor',
  'Select a Press Relation Officer (P.R.O.)',
];
const SEMICOLON_PARTY_LABELS = [
  'DASIG, John Westen Rey (Semicolon Party)',
  'BADON, Raven Vera (Semicolon Party)',
  'ALTONAGA, John Stanley (Semicolon Party)',
  'PEREZ, Greleen (Semicolon Party)',
  'MALTO, Lanz Alexander (Semicolon Party)',
  'JUGAR, Pete Aejosh (Semicolon)',
];
const SEMICOLON_PARTY_NAMES = [
  'Dasig',
  'Badon',
  'Altonaga',
  'Perez',
  'Malto',
  'Jugar',
];
const SIGNAL_PARTY_LABELS = [
  'GAUDAN, Gianne Guenter (Signal Party)',
  'JALANDONI, Jea Katrina (Signal Party)',
  'TE, Alexandra Margaret (Signal Party)',
  'OLICIA, Samantha Kyle (Signal Party)',
  'DE JESUS, Giancarlo (Signal Party)',
  'PATALAN, Jozua Fabillar (Signal Party)',
];
const SIGNAL_PARTY_NAMES = [
  'Gaudan',
  'Jalandoni',
  'Te',
  'Olicia',
  'De Jesus',
  'Patalan',
];

export default function App() {
  const [workbookData, setWorkbookData] = useState([]);
  const [workbookPath, setWorkbookPath] = useState("");

  const [chartData, setChartData] = useState<ChartData<"bar">>();
  const [chartOptions, setChartOptions] = useState({
    indexAxis: 'y' as const,
    plugins: {
      title: {
        display: true,
        text: 'Results',
      },
      legend: {
        display: false,
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
      y: {
        stacked: true,
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
    },
  });

  const [voteProgressBarData, setVoteProgressBarData] = useState<ChartData<"bar">>();
  const [voteProgressBarOptions, setVoteProgressBarOptions] = useState({
    indexAxis: 'y' as const,
    plugins: {
      title: {
        display: true,
        text: 'Results',
      },
      legend: {
        display: false,
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
      y: {
        stacked: true,
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
    },
  });

  useEffect(() => {
    processChartData();
    processVoteProgressBar();
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
      const filteredColumns = WORKBOOK_COLUMNS.map((value) => (
        (workbookData.map((dataValue) => dataValue[value]))
      ));

      const semicolonPartyTotals = filteredColumns.map((value, index) => (
        value.reduce((acc, curr) => (
          (curr === SEMICOLON_PARTY_LABELS[index]) ? ++acc : acc
        ), 0)
      ));
      const signalPartyTotals = filteredColumns.map((value, index) => (
        value.reduce((acc, curr) => (
          (curr === SIGNAL_PARTY_LABELS[index]) ? ++acc : acc
        ), 0)
      ));
      const votesTotal = filteredColumns.map((value, index) => (
        semicolonPartyTotals[index] + signalPartyTotals[index]
      ));
      const semicolonPartyPercent = semicolonPartyTotals.map((value, index) => (
        value / votesTotal[index]
      ));
      const signalPartyPercent = signalPartyTotals.map((value, index) => (
        value / votesTotal[index]
      ));

      setChartData({
        labels: LABELS,
        datasets: [
          {
            label: 'Signal',
            data: signalPartyPercent,
            backgroundColor: '#ED81FF',
          },
          {
            label: 'Semicolon',
            data: semicolonPartyPercent,
            backgroundColor: '#B20000',
          },
        ],
      });
    } catch (e) {
      console.log(e);
    }
  }

  function processVoteProgressBar() {
    try {
      setVoteProgressBarData({
        labels: [0],
        datasets: [
          {
            data: [workbookData.length / MAX_VOTERS],
            backgroundColor: '#333333',
          },
          {
            data: [1 - workbookData.length / MAX_VOTERS],
            backgroundColor: '#D9D9D9',
          },
        ],
      });
    } catch (e) {
      console.log(e);
    }
  }

  return <>
    <h1>CCS Confed Election 2023 Results</h1>
    {!workbookData.length ? (
      <div className="button-container">
        <button
          onClick={workbookReadHandler}
        >
          Read Workbook
        </button>
      </div>
    ) : null}
    {workbookPath && (
      <div className="refresh-container">
        <button
          onClick={workbookRefreshHandler}
        >
          Refresh
        </button>
      </div>
    )}
    <main>
      {(workbookData.length && chartData) ? (
        <div className="sheet-results-container">
          <Bar
            data={chartData}
            options={chartOptions}
          />
        </div>
      ) : null}
      {(workbookData.length && voteProgressBarData) ? (
        <div className="vote-progress-container">
          <Bar
            data={voteProgressBarData}
            options={voteProgressBarOptions}
          />
        </div>
      ) : null}
    </main>
  </>
}
