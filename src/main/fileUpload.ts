import { BrowserWindow, dialog, ipcMain } from 'electron';
import XLSX, { utils } from 'xlsx';
import chokidar from 'chokidar';

let watcher;

function handleWorkbookOpen(window: BrowserWindow): any {
  return async (): Promise<Array<any>> => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
    });
    if (!canceled) {
      const workbook = XLSX.readFile(filePaths[0]);

      watcher = chokidar.watch(filePaths[0], {
        persistent: true,
      });

      watcher.on('change', path => handleWorkbookAutoRefresh(window, path));

      return (
        utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
      );
    }
    return null;
  }
}

async function handleWorkbookAutoRefresh(mainWindow: BrowserWindow, path: string) {
  try {
    const workbook = XLSX.readFile(path);
    const json = utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    mainWindow.webContents.send('workbook:autorefresh', json);
  } catch (e) {
    console.log(e);
  }
}

export function handleIpcMain(window: BrowserWindow) {
  ipcMain.handle('dialog:openFile', handleWorkbookOpen(window));
}