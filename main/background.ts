import {app, BrowserWindow} from 'electron';
import serve from 'electron-serve';
import {createWindow} from './helpers';
import CommunicationHandler from './communicationHandler';
import log from 'electron-log';
import path from "path";

// Create communication channels
CommunicationHandler();

// Configure logger
log.transports.file.level = 'info';
log.transports.file.resolvePathFn = () => path.join(app.getPath('logs'), new Date(Date.now()).toDateString() + '.log');

// Error handler
log.errorHandler.startCatching()


const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
	serve({directory: 'app'});
} else {
	app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
	await app.whenReady();
	
	if (BrowserWindow.getAllWindows().length === 0) {
		const mainWindow = createWindow('PackUI', {
			width: 1200,
			height: 800,
		});

		// Send popup event on error
		log.hooks.push((message, transport) => {
			
			if (message.level === 'error') {
				mainWindow.webContents.send('onError', message)
			}

			return message;
		})

		if (isProd) {
			await mainWindow.loadURL('app://./home.html');
		} else {
			const port = process.argv[2];
			await mainWindow.loadURL(`http://localhost:${port}/home`);
		}
	}
	log.info(`\n\n\nNEW APPLICATION BOOT AT ${new Date(Date.now()).toISOString()}\n\n\n`)
})();

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
