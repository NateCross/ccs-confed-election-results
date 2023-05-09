import { dialog, ipcMain } from 'electron';
import XLSX, { utils } from 'xlsx';

// async function handleFileOpen(): Promise<string | null> {
async function handleWorkbookOpen(): Promise<any> {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
  });
  if (!canceled) {
    const workbook = XLSX.readFile(filePaths[0]);
    return [
      utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]),
      filePaths[0],
    ];
  }
  return null;
}

async function handleWorkbookRefresh(event: any, path: string) {
  try {
    const workbook = XLSX.readFile(path);
    return utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
  } catch (e) {
    console.log(e);
  }
}

function testFunction(event: any, text: string) {
  console.log(text)
  return text;
}
export function handleIpcMain() {
  ipcMain.handle('dialog:openFile', handleWorkbookOpen);
  ipcMain.handle('test:print', testFunction);
  ipcMain.handle('workbook:refresh', handleWorkbookRefresh);

}