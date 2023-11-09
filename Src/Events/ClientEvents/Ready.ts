import Muzox from '../../Structures/Muzox_Client.js';
import config from '../../config.js';
import Event from '../../Interfaces/Event.js';
import { ActivityType, Guild, REST, Routes, TextChannel, VoiceChannel } from 'discord.js';
import Logger from '../../Resources/Console/MuzoxConsole.js';
//import checkReadyEventRegistration from '../../Resources/functions/clientData.js';
import { RgetQueue } from '../../Display/Utils/getReadyQueue.js';
import Queue from '../../Structures/Queue.js';
export default class Ready extends Event {
  constructor(client: Muzox, file: string) {
    super(client, file, {
      name: 'ready',
    });
    
  }


  public async run(): Promise<void> {
    const ReadyLogs: any = this.client.channels.cache.get(this.client.config.ClientReadyLogs);
    let count = 0;
    this.client.guilds.cache.forEach((guild) => { count += guild.memberCount })
    let statuses = `${this.client.user?.username} | ${this.client.config.Dprefix}help`;
    this.client.user?.setPresence({
      activities: [
        {
          name: statuses,
          type: ActivityType.Listening,
        },
      ],
      status: statuses as any,
    });
    const ReadyLog = this.client.mode.maintenance === true
      ? `: Client :: ${this.client.user?.tag} in 🔧 Maintenance`
      : `: Client :: ${this.client.user?.tag} :: Servers ${this.client.guilds.cache.size} :: Users : ${count}`;
      let rest: REST;
       new Promise((resolve, reject) => { rest = new REST({ version: '9' }).setToken(this.client.config.token ?? ''); 
      resolve(true) }).catch(e => Logger.log(e, "Error"));
      //console.log(rest)
      // =  new REST({version: '9'}).setToken(this.client.config.token ?? '');
      try{
       await rest.put(Routes.applicationCommands(this?.client?.user?.id), {body: this.client.slashData as any});
        //console.log(this.client.commands.map(v => v.data));
       
        Logger.log(`Successfully reloaded application (/)[${this.client.slashData.length}] commands.`,'[/]');
      } catch (e) {
        Logger.log(e, "Error")
      }



      /// 24/7
     const initialInterval = 5000; // Initial interval duration in milliseconds
     const hourInterval = 3600000; // 1 hour in milliseconds
    
     const Activate247 = async () => {
       try {
         const p = this.client.prisma?.twentyFourBySevenData;
         const allRecords = await p.findMany({
           where: {
             status: true,
           },
         });
    
         for (const record of allRecords) {
           const { guildId, channel, message }: { guildId: string | any, channel: string, message: string } = record;
           const xChannel = this.client.channels.cache.get(message) as TextChannel;
           const guildCheck = this.client.guilds.cache.get(guildId) as Guild;
           let shardId = xChannel?.guild?.shardId;
           if (shardId === undefined) {
             shardId = this.client.guilds.cache.get(guildId)?.shardId;
           }
    
           if (p && guildCheck) {
             try {
              const queue: Queue = await RgetQueue(this.client, guildId, channel, shardId);
              const player = queue.player;
              this.client.shoukaku.emit('playerCreate', player);
             } catch (e) {
               Logger.log(e, "Error");
             }
           } else if (!guildCheck) {
             console.log('Guild Not Connected :::' + guildId);
           }
         }
       } catch (e) {
         Logger.log(e, "Error");
       }
     };
    
     setTimeout(async () => {
       await Activate247();
       setInterval(async () => {
         await Activate247();
       }, hourInterval);
     }, initialInterval);
    



   
   // this.client.application?.commands.set(this.client.commands.map(v => v.data))
    if (this.client.config.logs === true) {
      ReadyLogs.send(`\`\`\`ts\n ${ReadyLog} Cores Activated 🟢\`\`\``)
    }
    Logger.log(`${ReadyLog}`, "Ready")
    
  }
}
