import { readdirSync } from 'fs';
import Logger from '../../Resources/Console/MuzoxConsole.js';
import Muzox from '../../Structures/Muzox_Client.js';
import { Muzox_Client } from '../Client/Muzox.js';

const Events_ = readdirSync("./dist/Events/ClientEvents")

export default function LoadMessageEvents(Muzox_Client:Muzox) {
  Events_.forEach(async (file) => {
    const event = (await import(`../../Events/ClientEvents/${file}`)).default
    const evt = new event(Muzox_Client, file);
    Muzox_Client.on(evt.name, (...args) => evt.run(...args))
  })

  Logger.log(`Loaded Events :: ${Events_.length}`, "Ready")
}
