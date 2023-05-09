import React, { useState } from 'react'

export default function App() {
  const [workbookData, setWorkbookData] = useState([]);
  const [testText, setTestText] = useState("");

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
    <div className="">
      <input type="text" onChange={(e) => setTestText(e.target.value)} />
      <input 
        type="submit" 
        value="Submit" 
        onClick={async (e) => {
          e.preventDefault();
          console.log(await (window as any).api.testFunction(testText));
        }}
      />
    </div>
  </>
}
