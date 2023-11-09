
import { ApplicationCommandOption, ChatInputCommandInteraction, CommandInteraction, Message, PermissionResolvable } from 'discord.js'
import Muzox from '../Structures/Muzox_Client.js';
import Context from '../Structures/Manager/CTX.js';
export interface Command {
    data: {
        name: string,
        description: string,
        type?: any,
        dev?:boolean,
        voice?: boolean,
        queue?: boolean,
        player?: boolean,
        samevc?: boolean,
        botconnection?: boolean,
        options?: ApplicationCommandOption[]
    },
    permissions?: string[],
    run(...args: any[]): any
}


export interface messageCommands {
    data: {
        name: string;
        userPerms ?: PermissionResolvable[];
        aliases?: string[];
        description: string;
        dev?:boolean;
        voice?:boolean;
        queue?: boolean,
        player?: boolean;
        samevc?: boolean,
        botconnection?: boolean;
        permissions?: PermissionResolvable[];
        playlist?: boolean;
        slash ?: boolean;
        vote?: boolean;
        playing?: boolean;
        SlashData?: {
            Name ?: string;
            options?: ApplicationCommandOption[];
        },
        Switches?: {
            FullErr ?: boolean;
            SameVcErr ?: boolean;
            BotConnectionErr ?: boolean;
            QueueErr ?: boolean;
            PlayerErr ?: boolean;
            VoiceErr ?: boolean;
            DevErr ?: boolean;
            ViewErr ?: boolean;

        }

        
    }

    execute: (client: Muzox, message: CommandInteraction | Message | Context, args: string[], superInteraction?:ChatInputCommandInteraction | CommandInteraction) => any
}