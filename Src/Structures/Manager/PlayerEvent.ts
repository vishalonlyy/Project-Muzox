import { CommandInteraction, Message } from "discord.js";
import { Muzox, Queue } from "../../Resources/modules/index.js"
import { EventEmitter } from "events";


export default class PlayerEventManager extends EventEmitter {
    client: Muzox;
    CTXManager: CommandInteraction | Message;
    Guild: string | number;
    QueueManager: Queue;
    Myemit: string;
    Queue: Queue;

    public async PlayerEnd(queue: Queue, ctxManager: CommandInteraction | Message) {
        // queue.skip();
         queue.tracks.shift();
         if (queue.size > 1) {
             queue.playing = true;
            // queue.play(queue.tracks[0], queue.AnnouncementChannel, queue.requester, ctxManager);
         } 
        this.emit('QueueEnd');
    }
}