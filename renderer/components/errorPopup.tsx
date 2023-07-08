import Popup from "reactjs-popup";
import {useState} from "react";
import {ipcRenderer} from "electron";
import log from "electron-log";
import {GetErrorMessage} from "../public/ErrorTitles";
import Translator from "@tools/translator";

interface Status {
	shown: boolean,
	message: string,
	location: string
}

export default function ErrorPopup() {
	const [status, toggleStatus] = useState<Status>({shown: false, message: "", location: ""});

	if (ipcRenderer) {
		ipcRenderer.on('onError', (event, data: log.LogMessage) => toggleStatus({
			shown: true,
			message: data.data.join(', '),
			location: data.scope
		}))
	}

	return <Popup open={status.shown} position="center center"
	              onClose={() => toggleStatus({shown: false, message: status.message, location: status.location})}>
		<div className="bg-black rounded-3xl text-white bg-opacity-90 w-[50vw] h-[50vh] bg-black flex-1 p-4 relative">
			<h1 className="text-2xl font-bold mx-auto text-center">{GetErrorMessage()}</h1>
			<hr className="my-4"/>
			<p className="text-xl font-mono mx-auto">{status.message}</p>
			<p className="text-xl font-mono mx-auto">{status.location}</p>
			<p className="absolute bottom-4 opacity-25 text-center w-full -ml-4"><Translator translation="error.close" /></p>
		</div>
	</Popup>
}
