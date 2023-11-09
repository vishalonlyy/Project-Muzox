import { EmbedBuilder } from "discord.js";
import { Messages, Muzox_Client } from "../../Resources/modules/index.js";
import config from "../../config.js";
const userId = '1014533266151313458'; // replace with the user ID you want to get the avatar URL of
const user = await Muzox_Client.users.fetch(userId); // fetch the user object from the API
const avatarUrl = user.avatarURL(); // get the URL for the user's avatar (in PNG format, size 256x256)

// export async function EmbedManager(x:string){
//     const embed = new EmbedBuilder()
//     .setColor(Messages.Mconfigs.color)
//     .setDescription(x)
//     return embed;
// }


const CommonEmbed = new EmbedBuilder()
.setColor(Messages.Mconfigs.color)

export {
    CommonEmbed
}