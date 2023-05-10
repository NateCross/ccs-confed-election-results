import React, { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  ChartData,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Candidate from './components/Candidate';
import Annotation from 'chartjs-plugin-annotation';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Annotation,
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
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Results',
      },
      legend: {
        display: false,
      },
      annotation: {
        annotations: {
          line: {
            type: 'line',
            mode: 'vertical',
            xMin: 0.5,
            xMax: 0.5,
            borderColor: 'black',
            borderWidth: 2,
          }
        }
      }
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
    maintainAspectRatio: false,
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

  const [candidateImages, setCandidateImages] = useState([]);
  const [partyTotals, setPartyTotals] = useState([]);

  useEffect(() => {
    processChartData();
    processVoteProgressBar();
  }, [workbookData]);
  useEffect(() => {
    loadCandidateImages();
  }, []);

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

      setPartyTotals([signalPartyTotals, semicolonPartyTotals]);

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

  function getCandidateImage(name: string, extension: string) {
    return import(`../assets/${name.toUpperCase()}.${extension.toLowerCase()}`)
  }

  async function loadCandidateImages() {
    try {
      setCandidateImages([
        await Promise.all(SIGNAL_PARTY_NAMES.map(async (value) => getCandidateImage(value, 'png'))),
        await Promise.all(SEMICOLON_PARTY_NAMES.map(async (value) => getCandidateImage(value, 'jpeg'))),
      ]);
    } catch (e) {
      console.log(e);
    }
  }

  return <>
    <h1>CCS Confed Election 2023 Results</h1>
    <main>
      {(workbookData.length && chartData) ? (
        <div className="sheet-results-container">
          <div className="results-left-container">
            {SIGNAL_PARTY_NAMES.map((value, index) => (
              <Candidate 
                name={value}
                imagePath={candidateImages[0][index].default}
                voteTotal={partyTotals[0][index]}
                key={value}
              />
            ))}
          </div>
          <div className="results-center-container">
            <Bar
              data={chartData}
              options={chartOptions as any}
            />
          </div>
          <div className="results-right-container">
            {SEMICOLON_PARTY_NAMES.map((value, index) => (
              <Candidate 
                name={value}
                imagePath={candidateImages[1][index].default}
                voteTotal={partyTotals[1][index]}
                reversed
                key={value}
              />
            ))}

          </div>
        </div>
      ) : null}
      {(workbookData.length && voteProgressBarData) ? (
        <div className="vote-progress-container">
          <div className="vote-progress-text-container">
            <p className="vote-progress-main-text">
              Total Votes Checked
            </p>
            <p className="vote-progress-numbers">
              {workbookData.length / MAX_VOTERS * 100}% ({workbookData.length} out of {MAX_VOTERS}) 
            </p>
          </div>
          <div className="vote-progress-bar-container">
            <Bar
              data={voteProgressBarData}
              options={voteProgressBarOptions}
            />
          </div>
        </div>
      ) : null}
    </main>
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
  </>
}
