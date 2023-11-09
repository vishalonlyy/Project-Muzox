import { readdirSync } from 'fs';
import Logger from '../../Resources/Console/MuzoxConsole.js';
import Muzox from '../../Structures/Muzox_Client.js';
import { Muzox_Client } from '../Client/Muzox.js';
import { messageCommands } from '../../Interfaces/Interfaces.js';
import { ApplicationCommandType, SlashCommandBuilder, ApplicationCommandOption } from 'discord.js';
// module.exports = async (Muzox_Client:Muzox) => {

// }
export default async function LoadSlash(Muzox_Client:Muzox){
  const files = readdirSync("./dist/Window/Commands", { withFileTypes: true });
  let count = 0;

  for (const file of files) {
    if (file.isDirectory()) {
      const category = file.name;
      const commandFiles = readdirSync(`./dist/Window/Commands/${category}`).filter(file => file.endsWith('.js'));
      for (const commandFile of commandFiles) {
        const command : messageCommands = (await import(`../../Window/Commands/${category}/${commandFile}`)).default;
        if (command && command.data?.slash  || command.data?.SlashData?.Name) {
          const data = {
            name : command.data.name,
            description : command.data.description,
            type: ApplicationCommandType.ChatInput,
            options: command.data.SlashData.options ? command.data.SlashData.options : null,
            
          }
          const Convert_json = JSON.stringify(data);
          
          Muzox_Client.slashData.push(JSON.parse(Convert_json))
          //Muzox_Client.commands.set(command.data.SlashData.Name, command);
          count++;
        } else {
          Logger.log(`: One of The File in :: [${category}]:: is Missing Name`, '[Warn]');
        }
      }
    }
  }

  Logger.log(`loaded SlashCommands :: ${count}`, "[/]");
}