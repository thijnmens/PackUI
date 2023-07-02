import fs from "fs/promises";
import fss from "fs";
import path from "path";
import Config from "../helpers/config";
import {app} from "electron";
import Logger from "electron-log";


export default class Translator {
	translations: any = {};
	
	constructor() {
		const lang = new Config().language
		const langPath = path.join(app.getPath('userData'), `/languages/${lang}.lang`)

		if (!fss.existsSync(langPath)) {
			Logger.error(`Unknown language: "${lang}"`);
			return;
		}

		this.translations = JSON.parse(fss.readFileSync(langPath).toString());
	}
	
	async GetTranslation(id: string): Promise<string> {
		return new Promise<string>(async (resolve) => {			
			this.translations[id] ? resolve(this.translations[id]) : resolve(`Unknown id: "${id}"`);
		});
	}
	
	async GetAvailableLanguages() : Promise<string[]> {
		return fs.readdir(path.join(app.getPath('userData'), 'languages'))
	}

	async CopyTranslations() {
		await fs.cp(path.join(__dirname, '../languages'), path.join(app.getPath('userData'), 'languages'), { recursive: true })
	}
	
	async ReloadTranslations() {
		this.translations = new Translator().translations;
	}
}