import React, { useState } from 'react'

export default function App() {
  const [workbookData, setWorkbookData] = useState([]);

  async function workbookReadHandler() {
    try {
      const data = await (window as any).api.openFile();
      setWorkbookData(data);
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
  </>
}
