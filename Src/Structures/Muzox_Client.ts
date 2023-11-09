import { Client, ClientOptions, Collection, GuildMember, LimitedCollection, RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord.js";
import { Command, messageCommands } from "../Interfaces/Interfaces.js";
import Logger from "../Resources/Console/MuzoxConsole.js";
import { ShoukakuClient } from "./index.js";
import fs from 'fs'
import config from '../config.js'
import Queue from "./Queue.js";
import { PrismaClient } from "@prisma/client";
import path from "path";
import { fileURLToPath } from "url";
import { ClusterClient } from "discord-hybrid-sharding";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export default class Muzox extends Client {
  public slashData: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
  public commands: Collection<string, Command> = new Collection();
  public messageCommands: Collection<string, messageCommands> = new Collection();
  public prisma = new PrismaClient();
  public logger: Logger = new Logger();
  public shoukaku: ShoukakuClient;
  public queue: Map<string, Queue> = new Map();
  public config = config;
  public mode = config.mode;
  public cluster = new ClusterClient(this)
  public constructor(options: ClientOptions) {
    super(options)
    options.makeCache = (manager) => {
      switch(manager.name){
        case "GuildEmojiManager":
        case "GuildInviteManager":
        case "GuildStickerManager":
        case "StageInstanceManager":
        case "ThreadManager":
          return new LimitedCollection({ maxSize: 0 });
        case "MessageManager":
          return new LimitedCollection({ maxSize: 1 });
        case "UserManager":
          return new LimitedCollection({ maxSize: 0 });
        case "GuildMemberManager":
          return new LimitedCollection({
            maxSize: 150,
            keepOverLimit :(member:GuildMember)=> member.id === this.user?.id,
              });
        default:
          return new Collection();
      }
    }
    this.shoukaku = new ShoukakuClient(this);
  }
  async loginBot(token: string | any) {
    super.login(token);
    this.shoukaku.on('error',(_, error) => console.log(error));
    this.LoadMuzoxEvents();
    this.prisma.$connect()
      .then(() => {
        console.log('Db checking => Connected');
      })
      .catch((err) => {
        console.log('Connecting failed')
        console.error(err)
      });
      setInterval(() => {
        this.PremiumUserChek();
      }, 24 * 60 * 60 * 1000);
  }
  private LoadMuzoxEvents(): void {
    const Events_ = fs.readdirSync(path.join(__dirname, "../Events/ClientEvents"));
    Events_.forEach(async (file) => {
        const event = (await import(`../Events/ClientEvents/${file}`)).default;
        const evt = new event(this, file);
        this.on(evt.name, (...args) => evt.run(...args));
    });
    Logger.log(`Loaded Events :: ${Events_.length}`, "Ready");
  }
   private LoadPlayerEvents(): void {
     const Events_ = fs.readdirSync(path.join(__dirname, "../Events/PlayerEvents"));
     Events_.forEach(async (file) => {
         const event = (await import(`../Events/PlayerEvents/${file}`)).default;
         const evt = new event(this, file);
         this.shoukaku.on(evt.name, (...args) => evt.run(...args));
     });
     Logger.log(`Loaded Events :: ${Events_.length}`, "Ready");
   }
   private async PremiumUserChek(): Promise<void> {
      const expiredUsers = await this.prisma.premiumUser.findMany({
        where: {
          Premium: true,
          PremiumExpires: {
            lte: new Date().toISOString() 
          }
        }
      });
      const update_u_to_f = await this.prisma.premiumUser.updateMany({
        where: {
          id: {
            in: expiredUsers.map(user => user.id) 
          }
        },
        data: {
          Premium: false
        }
      });
   }
  }
