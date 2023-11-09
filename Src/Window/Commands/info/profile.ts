import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, CommandInteraction, EmbedBuilder, Message, User } from 'discord.js';
import { Muzox, Queue, Logger, ContextManager, messageCommands, Messages, EmojisPacket } from '../../../Resources/modules/index.js';
export default <messageCommands>{
    data: {
        name: 'profile',
        description: "check your profile page",
        vote: false,
        aliases: ['badges', 'badge'],
        permissions: ['EmbedLinks', 'SendMessages'],
        slash: true,
        SlashData: {
            Name: 'profile',
            options: [{
                name: 'user',
                description: 'user to check profile',
                type: ApplicationCommandOptionType.User,
                required: false
            }]
        },
    },
    execute: async (client: Muzox, message: ContextManager, args: string[]) => {
        try {
            if (message.CheckInteraction) {
                await message.setDeffered(false);
            }
            const p = client.prisma.user;
            const prisma = client.prisma.premiumUser;
            var support = Messages.Links.SupportLink;
            let user: any;
            if (message.CheckInteraction) {
                let Mention = message.interaction?.options?.get('user', false)?.value
                if (!Mention) Mention = message.author.id;
                user = Mention //|| message.author.id;
            } else {
                let Mention: User = message.mentionedUsers as User;
                if (!Mention) Mention = message.author;
                user = Mention.id
            }
            const UserData: User | any = await client.users.fetch(user).catch((e: any) => { });
            const findPremiumUser = await prisma.findUnique({
                where: {
                    userId: user
                }
            })
            const badges_DB = await p.findUnique({
                where: {
                    userId: user
                }
            })
            

            const premium_: string | any = findPremiumUser ? true : false;
            //const vishal: string | any = user === "1014198346656792667" ? true : false;
            const guildd: string | number | any = await client.guilds.fetch("936226552256036926");
            const sus: any = await guildd.members.fetch(user).catch((e: any) => { });
            let badges = "";
            let Dev_B = false;
            let Owner_B = false;
            let Admin_B = false;
            let Staff_B = false;
            let Vip_B = false;
            let Friend_B = false;
            let Premium_B = false;
            let BotUser_B = false;
            if (sus.roles.cache.has("1006174492160164002") || badges_DB?.Badges.includes("Developer")) {
                Dev_B = true;
            }
            if (sus.roles.cache.has("937612786069012480") || badges_DB?.Badges.includes("Owner")) {
                Owner_B = true;
            }
            if (sus.roles.cache.has("1006174292062519317") || badges_DB?.Badges.includes("Admin")) {
                Admin_B = true;
            }
            if (sus.roles.cache.has("1005488777671741582") || badges_DB?.Badges.includes("Staff")) {
                Staff_B = true;
            }
            if (sus.roles.cache.has("988506196468170803") || badges_DB?.Badges.includes("Vip")) {
                Vip_B = true;
            }
            if (sus.roles.cache.has("1006174648502845540") || badges_DB?.Badges.includes("Friend")) {
                Friend_B = true;
            }
            // if (vishal === true) badges = badges + `\n${EmojisPacket.Emojis.Badges.owner} **~ Vishal **`;
            if (Dev_B === true) badges = badges + `\n${EmojisPacket.Emojis.Badges.dev} **Developer**`;
            if (Owner_B === true) badges = badges + `\n${EmojisPacket.Emojis.Badges.owner} **Owner**`;
            if (Admin_B === true) badges = badges + `\n${EmojisPacket.Emojis.Badges.admin} **Admin**`;
            if (Staff_B === true) badges = badges + `\n${EmojisPacket.Emojis.Badges.staff} **Staff**`;
            if (Vip_B === true) badges = badges + `\n${EmojisPacket.Emojis.Badges.vip} **Vip**`;
            // const bro = sus.roles.cache.has("1006174648502845540") || badges_DB.Badges.includes("Friend");
            if (Friend_B === true) badges = badges + `\n${EmojisPacket.Emojis.Badges.friends} **Friend**`;
            const premium = sus.roles.cache.has("1006174600113176576") || premium_ === true;
            if (premium === true) badges = badges + `\n${EmojisPacket.Emojis.Badges.premium} **Premium**`;
            const botuser = sus.roles.cache.has("1028976084802342962");
            if (botuser === true) badges = badges + `\n${EmojisPacket.Emojis.Badges.user} **Member**`;
            const embed = new EmbedBuilder()
                .setAuthor({ name: `${UserData.tag}`, iconURL: UserData.displayAvatarURL({ size: 1024 }) })
                .setThumbnail(UserData.displayAvatarURL({ size: 1024 }))
                .setColor(Messages.Mconfigs.Ucolor)
                .addFields([{ name: `**__Badges__**`, value: `${badges ? badges : `Oops! Looks Like You Don't Have Any Type Of Badge To Be Displayed! You Can Get One By Joining Our [Support Server](${support})`}` }])
                ;
            message.reply({ embeds: [embed] })
        } catch (e) {
            Logger.log(e, 'Error')
        }
    }
} 
