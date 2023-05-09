import { dialog, ipcMain } from 'electron';

async function handleFileOpen(): Promise<string | null> {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
  });
  if (!canceled) return filePaths[0];
  return null;
}

export function handleIpcMain() {
  ipcMain.handle('dialog:openFile', handleFileOpen);
}