import { Player, Track } from "shoukaku";
import Muzox from "./Muzox_Client.js";
import { Muzox_Client } from "../Core/Client/Muzox.js";
import { CommandInteraction, Message, User } from "discord.js";
import { EventEmitter } from "events";
import PlayerEventManager from "./Manager/PlayerEvent.js";
import parseTime from "../Display/Utils/parsetime.js";
import PlayerStarted from "./playerFunctions/events/playerStarted.js";
import { Autoplay, CheckAutoPlayEnable } from "./playerFunctions/events/autoplay.js";
import TrackEnd from "./playerFunctions/events/TrackEnd.js";
import QueueEnd from "./playerFunctions/events/QueueEnd.js";
export default class Queue {
  guildId: string;
  tracks: any[];
  previous: any[];
  filters: any[]
  loop: number | boolean;
  LoopQueueData: any[];
  autoplay: boolean;
  volume: number;
  playing: boolean;
  stopped: boolean;
  requester: User | any;
  player: Player;
  exec: boolean;
  AnnouncementChannel: string;
  shuffle: boolean;
  CTX: CommandInteraction | Message;
  client: Muzox;
  playerEventManager: PlayerEventManager;
  Forwarded: number | null;
  Revinded: number | null;
  queueEnded: boolean;
  eventEmitter: EventEmitter;
  mainmsg: any;
  //client: Muzox;
  constructor(guildId: string, player: Player, tracks: any[] = [], filters: any[] = []) {
    this.client = Muzox_Client;
    this.guildId = guildId;
    this.tracks = tracks;
    this.previous = [];
    this.filters = filters;
    this.loop = 0;
    this.LoopQueueData = [];
    this.autoplay = false;
    this.volume = 100;
    this.playing = false;
    this.stopped = false;
    this.requester = null;
    this.player = player;
    this.exec = true;
    this.CTX = null;
    this.AnnouncementChannel = ''
    this.shuffle = false;
    this.Forwarded = null;
    this.Revinded = null;
    this.eventEmitter = new EventEmitter();
    this.mainmsg = null;
    this.eventEmitter.on("loopChanged", (loop: number) => {
      this.loop = loop;
    });
    this.eventEmitter.on('trackend', async (loop?: boolean) => {
      await TrackEnd(this);
    })
    this.eventEmitter.on('queueend', async () => {
      await QueueEnd(this);
    });
    this.eventEmitter.on('TQemitter', async () => {
      if (this.tracks.length > 0) {
        this.eventEmitter.emit('trackend')
      } else {
        if (this.tracks.length === 0) {
          this.clear();
          await this.player.destroyPlayer();
          this.playing = false;
          this.tracks = [];
          this.previous = [];
          this.Leave(2000);
        }

        this.eventEmitter.emit('queueend')
      }
    })
  }
  public async Leave(Interval?: number) {
    const Lvc = () => {
      this.client.shoukaku.leaveVoiceChannel(this.guildId).catch(e => { });
    }
    if (Interval) {
      setTimeout(Lvc, Interval);
    } else {
      Lvc();
    }
  }
  public async push(track: any) { // Use push method to add tracks to the array
    this.playing = true;
    this.tracks.push(track);
  }
  public async remove(index: number) {
    this.tracks.splice(index, 1);
  }
  public async clear() {
    this.tracks = [];
    //this.player.stopTrack();
  }
  get title() {
    for (let i = 0; i < this.tracks.length; i++) {
      if (this.tracks[i].info && this.tracks[i].info.title) {
        return this.tracks[i].info.title;
      }
    }
  }
  get author() {
    for (let i = 0; i < this.tracks.length; i++) {
      if (this.tracks[i].info && this.tracks[i].info) {
        return this.tracks[i].info.title;
      }
    }
  }
  get Requester() {
    return this.requester?.username || 'Unknown';
  }
  get size() {
    return this.tracks.length;
  }
  get currentTrack() {
    for (let i = 0; i < this.tracks.length; i++) {
      if (this.tracks[i].info && this.tracks[i].info.title) {
        return this.tracks[i];
      }
    }
    //return this.tracks[0];
  }
  get currentTrackAuthor() {
    return this.currentTrack?.info?.author;
  }
  get currentTrackIndex() {
    for (let i = 0; i < this.tracks.length; i++) {
      if (this.tracks[i].info && this.tracks[i].info.title) {
        return i;
      }
    }
  }
  get currentTrackTitle() {
    return this.currentTrack?.info?.title;
  }
  get currentTimeLeft() {
    const x: number = this.player.position;
    const y: number = this.currentTrack?.info?.length;
    return y - x;
    // return this.player.position - this.currentTrack?.info?.length;
  }
  public async skip(skipat = 1) {
    if (!this.player) return;
    if (skipat > 1) {
      this.tracks.unshift(this.tracks[skipat - 1]);
      this.tracks.splice(skipat, 1);
    }
    if (this.loop === 2) {
      this.tracks.push(this.currentTrack);
      // console.log("mode activated")
    }
    if (this.previous.length <= 10) {
      Promise.resolve(this.previous.push(this.currentTrack)).then(async () => {
        // console.log({ privousTrack: this.previous[0].info.title }, { currentTrack: this.currentTrack.info.title }, { previousObject: this.previous.map(x => x.info.title) })
        this.player.stopTrack();

        if (this.autoplay === false && this.tracks.length === 0) {
          this.playing = false;
        } await this.mainmsg.delete().catch(e => { })
      })
    } else {
      Promise.resolve(this.previous = []).then(async () => {
        this.skip();
      })

      // Promise.resolve(this.previous.push(this.currentTrack)).then(async () => {
      //   console.log({ privousTrack: this.previous[0].info.title }, { currentTrack: this.currentTrack.info.title }, { previousObject: this.previous.map(x => x.info.title) })
      //   this.player.stopTrack();

      //   if (this.autoplay === false && this.tracks.length === 0) {
      //     this.playing = false;
      //   } await this.mainmsg.delete().catch(e => { })
      // })
    }
  }
  public async previousTrack() {
    if (!this.player) return;
    if (this.previous.length < 1) return; let lastTrack;
    if (this.previous.length > 1) {
      lastTrack = this.previous[this.previous.length - 1];
      this.previous.filter((x) => x !== lastTrack.info.title)
    }
    else { lastTrack = this.previous[0]; }
    this.player.setPaused(true).then(() => {
      this.tracks.splice(1, 0, lastTrack);
      this.player.setPaused(false).then(() => {
        this.skip();
      })

    })
  }
  public async loopManager(x?: 0 | 1 | 2) {
    if (x) {
      this.loop = x;
    } else {
      const L: number | boolean = this.loop;
      switch (L) {
        case 0:
          this.loop = 1;
          break;
        case 1:
          this.loop = 2;
          break;
        case 2:
          this.loop = 0;
          break;
      }
      this.eventEmitter.emit("loopChanged", this.loop);
      return this.loop;

    }
  }

  public async seek(time: number) {
    if (!this.player) return;
    this.player?.seekTo(time);
  }
  public async forward(time?: number) {
    if (!this.player) return;
    if (!time) time = parseTime('5s');
    this.Forwarded = this.player.position + time;
    this.player?.seekTo(this.Forwarded);
  }
  public async rewind(time?: number) {
    if (!this.player) return;
    if (!time) time = parseTime('5s');
    else if (time) {
      time = parseTime(`${time}`);
    }
    this.Revinded = this.player.position - time;
    this.player?.seekTo(this.Revinded);
  }

  public async play(song: Track | any | null, channel: string, author: any, message: Message | CommandInteraction) {
    let instanceMSG: Message | any = null;
    this.playing = true;

    while (this.loop === 1 || this.tracks.length > 0) {
      const currentTrack = this.tracks[0];
      this.requester = author;
      this.AnnouncementChannel = channel;
      this.CTX = message;
      const voiceState = message.guild?.voiceStates.cache.get(message.member?.user.id);
      const channelId: any = voiceState?.channelId;
      const dispatcher: Player = this.player;

      await dispatcher.playTrack({ track: currentTrack.encoded as string });

      if (!this.playing || this.size !== 0) {
        PlayerStarted(this);
      }
      await new Promise<void>((resolve) => {
        dispatcher.once("end", async () => {
          resolve();
        });
      });
      this.tracks.shift();
      if (this.loop === 1) {
        this.tracks.push(currentTrack); // If loop is enabled, add the current track to the end of the queue again
      } else {
        const check = await CheckAutoPlayEnable(this)
        if (check === true) {
          await Autoplay(this);
        }
      }
    }
    this.eventEmitter.emit('TQemitter', true);
  }
  public async shuffleManager(shuffle?: boolean) {
    if (!this.player) return;
    this.shuffle = shuffle;
    if (shuffle === true) {
      const current = this.tracks.shift();
      this.tracks = this.tracks.sort(() => Math.random() - 0.5);
      this.tracks.unshift(current);
    } else {
      const current = this.tracks.shift();
      this.tracks = this.tracks.sort((a: any, b: any) => a - b);
      this.tracks.unshift(current);
    }
    if (!shuffle) {
      if (this.shuffle === true) {
        this.shuffle = false;
      } else if (this.shuffle === false) {
        this.shuffle = true;
      } else {
        this.shuffle = true;
      }
    }
  }
}
