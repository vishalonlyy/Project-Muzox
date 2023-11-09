import { readdirSync } from 'fs';
import Logger from '../../Resources/Console/MuzoxConsole.js';
import Muzox from '../../Structures/Muzox_Client.js';
import { messageCommands } from '../../Interfaces/Interfaces.js';

export default async function LoadCommands(Muzox_Client:Muzox) {
  const files = readdirSync("./dist/Window/Commands", { withFileTypes: true });
  let count = 0;

  for (const file of files) {
    if (file.isDirectory()) {
      const category = file.name;
      const commandFiles = readdirSync(`./dist/Window/Commands/${category}`).filter(file => file.endsWith('.js'));
      for (const commandFile of commandFiles) {
        const command : messageCommands | any = (await import(`../../Window/Commands/${category}/${commandFile}`)).default;
        if (command && command?.data?.name) {
          Muzox_Client.messageCommands.set(command.data.name, command);
          if (command.data.aliases && command.data.aliases.length > 0) {
            for (const alias of command?.data?.aliases) {
              Muzox_Client.messageCommands.set(alias, command);
            }
          }
          

          count++;
        } else {
          Logger.log(`: One of The File in :: [${category}]:: is Missing Name[Message Commands]`, '[Warn]');
        }

      }
    }
  }

  Logger.log(`loaded MessageCommands :: ${count}`, "Loaded");
  
}
