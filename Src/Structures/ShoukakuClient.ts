import { readdirSync } from "fs";
import { Shoukaku, Connectors } from "shoukaku";
import Logger from "../Resources/Console/MuzoxConsole.js";
import Muzox from "./Muzox_Client.js";
import config from "../config.js";

const Nodes = [{
    name: 'Localhost',
    url: 'localhost:4051',
    auth: 'youshallnotpass'
}]
export default class ShoukakuClient extends Shoukaku{
    public client: Muzox;
   
//     public getIdealNode (nodes , connection){
        
//         nodes = [ ...nodes.values() ];
//         return nodes.find(node => node.group === connection.region);
    

// }
    
    constructor(client: Muzox) {
        super(new Connectors.DiscordJS(client),
             config.lavalink,
            {
                moveOnDisconnect: false,
                resume: false,
                reconnectInterval: 10000,
                reconnectTries: 50,
                restTimeout: 10000,
            },
            
            
        );


        
        this.client = client;
        
        
       this.on('disconnect', (name, players, moved) => {
            if (moved) this.emit('playerMove', players);
            this.client.shoukaku.emit('nodeDisconnect', name, players);
        });
       
        this.on('ready', (name, resumed) =>
        this.client.shoukaku.emit(
            resumed ? 'nodeReconnect' : 'nodeConnect',
            this.client.shoukaku.getIdealNode(),
        ),
    );

    this.on('error', (name, error) =>
        this.client.shoukaku.emit('nodeError', name, error),
    );

    this.on('close', (name, code, reason) =>
        this.client.shoukaku.emit('nodeDestroy', name, code, reason),
    );

    this.on('debug', (name, reason) =>
        this.client.shoukaku.emit('nodeRaw', name, reason),

    );
    
    }

   
}





