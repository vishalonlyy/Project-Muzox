import { EmbedBuilder } from 'discord.js';
import { Muzox, Queue, Logger, ContextManager, messageCommands, Messages, EmojisPacket } from '../../../Resources/modules/index.js';
import { allButton } from '../../../Display/GlobalEmbeds/privateButtons.js';
export default<messageCommands> {
    data: {
        name: 'about',
        description: `displays the bots info`,
        vote: false,
        aliases:[],
        permissions:['EmbedLinks','SendMessages'],
        slash: true,
        SlashData: {
            Name: 'about',
            options: []
          },
    },
    execute : async(client : Muzox, message:ContextManager, args:string[])=> {   
        try{
            if(message.CheckInteraction){
                await message.setDeffered(false);
            }
            let about:string = `Hey, It's Me Muzox Unleash The Music Power With Me a Feature Packed Bot For The Ultimate Music Experience. Try Muzox Now!`;
            type dev = {
                name : string,
                id : string,
                cString : string
            }[]
            let _devs:dev = [];
            for(let i = 0; i < client.config.devs.length; i++){
                const user = (await client.users.fetch(client.config.devs[i]));
                _devs.push({name:user.username,id:user.id,cString:`[${user.username}](https://discord.com/users/${user.id})`})
            } 

            const sucessEmbed = new EmbedBuilder()
            .setAuthor({ name: `About ${client.user.username}`, iconURL: client.user.avatarURL(), url: `${Messages.Links.SupportLink}` })
            .setThumbnail(client.user.avatarURL())
            .setColor(Messages.Mconfigs.Ucolor)
            .setDescription(about)
            .addFields(
                { name: `**Developers**`, value: `${_devs.map((x) => x.cString).join(",")}`, inline:true },
                { name: `**Emojis**`, value: `[icons](https://discord.com/invite/icons-859387663093727263)`, inline:true },
                {name:`**Social**`, value:`[Website](https://www.muzoxbot.xyz)`,inline:true},
                ) 
            message.reply({
                embeds : [sucessEmbed], components: [allButton]
            })
    } catch(e){
        Logger.log(e,"Error")
    }
    }
} 
