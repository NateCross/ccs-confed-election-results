import React, { useState } from 'react'
import XLSX, { WorkBook } from 'xlsx';

export default function App() {
  const [filePath, setFilePath] = useState<string>('');
  const [workbook, setWorkbook] = useState<WorkBook>();

  async function clickHandler() {
    const path = await (window as any).api.openFile();
    setFilePath(path);
  }

  async function workbookHandler(): Promise<void> {
    try {
      const file = XLSX.readFile(filePath);
      setWorkbook(file);
      console.log(workbook);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  return <>
    <h1>Results</h1>
    {filePath && (
      <p>File Path: {filePath}</p>
    )}
    {filePath && (
      <button
        onClick={workbookHandler}
      >
        Read Workbook
      </button>
    )}
    <div className="button-container">
      <button
        onClick={clickHandler}
      >
        Set File
      </button>
    </div>
  </>
}
