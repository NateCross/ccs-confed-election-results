// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron"

// TODO: https://www.electronjs.org/docs/latest/tutorial/ipc#pattern-3-main-to-renderer
contextBridge.exposeInMainWorld('api', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  autorefreshWorkbook: (
    callback: (
      event: Electron.IpcRendererEvent, 
      ...args: any[]
    ) => void,
  ) => ipcRenderer.on('workbook:autorefresh', callback),
  testFunction: (text: string) => ipcRenderer.invoke('test:print', text),
  refreshWorkbook: (path: string) => ipcRenderer.invoke('workbook:refresh', path),
})