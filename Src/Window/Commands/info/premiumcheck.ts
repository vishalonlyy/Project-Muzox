import { ActionRowBuilder, ComponentType, EmbedBuilder, Message, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { Muzox, Queue, Logger, ContextManager, messageCommands, Messages, EmojisPacket } from '../../../Resources/modules/index.js';
export default <messageCommands>{
  data: {
    name: 'premiumcheck',
    description: "check/view premium status according to the type",
    vote: false,
    voice: false,
    queue: false,
    player: false,
    samevc: false,
    botconnection: false,
    aliases:['premiumstatus','checkPremium','checkpremium'],
    permissions: ['SendMessages'],
    slash: true,
    SlashData: {
        Name: 'premiumcheck',
        options: []
      },
  },
  execute: async (client: Muzox, message: ContextManager, args: string[]) => {
    try{
      if (message.CheckInteraction) {
        await message.setDeffered(false);
    }
        const prisma = client.prisma;
        const userId_ : string = message.author.id;
        const select = new StringSelectMenuBuilder()
        .setCustomId('Main Page')
        .setPlaceholder('Select Your Menu')
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel('UserPremium')
                .setDescription('Display UserPremiumStatus')
                .setValue('UserPremium'),
            new StringSelectMenuOptionBuilder()
            .setLabel('GuildPremium')
            .setDescription('Display Guild Premium Status')
            .setValue('GuildPremium'),
        )
        const row : ActionRowBuilder | any = new ActionRowBuilder()
        .addComponents(select)
        const Main_Page = new EmbedBuilder()
        .setAuthor({ name: "Muzox", iconURL: client.user.displayAvatarURL() })
        .setThumbnail(message.client.user.displayAvatarURL())
        .setColor(Messages.Mconfigs.Ucolor)
        .setDescription(`Check your Premium status for \`guildpremium\` or \`userpremium\`  : \n\n By the below menu select the type offered by :: **${client.user.username}**`)
            await message.reply({
                embeds : [Main_Page],
                components : [row]
            }).then(async (message)=> {
                const collector = message.createMessageComponentCollector({componentType: ComponentType.StringSelect});
                const UserPremium = await prisma.premiumUser.findUnique({
                    where: {
                      userId: userId_,
                    },
                  });
                // console.log(UserPremium)
                  let userPremiudata_: any;
                  if (UserPremium) {
                    // console.log("User is a premium user");
                    userPremiudata_ = new EmbedBuilder()
                      .setAuthor({ name: "Muzox", iconURL: client.user.displayAvatarURL() })
                      .setFields(
                        { name: 'Premium:', value: `\`\`\`ts\n${UserPremium?.Premium}\`\`\``, inline: false },
                        { name: 'PremiumSince:', value: `\`\`\`ts\n${UserPremium?.PremiumSince}\`\`\``, inline: false },
                        { name: 'PremiumExpires:', value: `\`\`\`ts\n${UserPremium?.PremiumExpires}\`\`\``, inline: false },
                        { name: 'Tier:', value: `\`\`\`ts\n${UserPremium?.PremiumType}\`\`\``, inline: false },
                        { name: 'PremiumSubscriptionCount:', value: `\`\`\`ts\n${UserPremium?.PremiumSubscriptionCount}\`\`\``, inline: false }
                      )
                      .setColor(Messages.Mconfigs.Ucolor)
                      ;
                  } else {
                    // console.log("User is not a premium user");
                    userPremiudata_ = new EmbedBuilder()
                      .setAuthor({ name: "Muzox", iconURL: client.user.displayAvatarURL() })
                      .setDescription(`No premium data available for this user.\n Join our support server to get premium / report issues about this [Support Server](${Messages.Links.SupportLink})`)
                      .setColor(Messages.Mconfigs.Ucolor)
                      ;
                  }
                  const Soon_ = new EmbedBuilder()
                    .setAuthor({ name: "Muzox", iconURL: client.user.displayAvatarURL() })
                    .setDescription(`Our Team is currently working on this feature, it will be available soon.\n Join our support server to get premium / report issues about this [Support Server](${Messages.Links.SupportLink})`)
                    .setColor(Messages.Mconfigs.Ucolor)
                    ;
                collector.on("collect", async (collected : any) => {
                    const value = collected.values[0]
                    if (value === "UserPremium") {
                      collected.reply({ embeds: [userPremiudata_], ephemeral: true })
                    }
                    if (value === "GuildPremium") {
                        collected.reply({ embeds: [Soon_], ephemeral: true })
                      }
                  })
            })
} catch(e){
    Logger.log(e,"Error")
}
  }
}