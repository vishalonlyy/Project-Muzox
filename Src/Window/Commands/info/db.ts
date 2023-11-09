import { ActionRowBuilder,ComponentType, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import { Muzox, Queue, Logger, ContextManager, messageCommands, Messages, EmojisPacket } from '../../../Resources/modules/index.js';
export default<messageCommands> {
    data: {
        name: 'db',
        description: 'Display the database of the server',
        vote: false,
        aliases:['database','showdatabase'],
        permissions:['EmbedLinks','SendMessages'],
        slash: true,
        SlashData: {
            Name: 'database',
            options: []
          },
        
    },
    
    execute : async(client : Muzox, message:ContextManager, args:string[])=> {   
        try{
          if(message.CheckInteraction){
            await message.setDeffered(false);
        }
            const prisma = client.prisma;


           
           

            const select = new StringSelectMenuBuilder()
            .setCustomId('Main Page')
            .setPlaceholder('Select Your Menu')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('GuildData')
                    .setDescription('Display GuildData, ex: Premium')
                    .setValue('GuildData'),
                new StringSelectMenuOptionBuilder()
                .setLabel('PrefixData')
                .setDescription('Display Guild Prefix Data')
                .setValue('PrefixData'),
                new StringSelectMenuOptionBuilder()
                .setLabel('24/7 Data')
                .setDescription('Display 24/7 Data')
                .setValue('_24_7')
            )

            const row : ActionRowBuilder | any = new ActionRowBuilder()
            .addComponents(select)

            const Main_Page = new EmbedBuilder()
            .setAuthor({ name: "Muzox", iconURL: client.user.displayAvatarURL() })
            .setThumbnail(message.client.user.displayAvatarURL())
            .setColor(Messages.Mconfigs.Ucolor)
            .setDescription(`Transparency Matters : \n\n By the below menu see the data stored of your server by **${client.user.username}**`)
                await message.reply({
                    embeds : [Main_Page],
                    components : [row]
                }).then(async (message : ContextManager | any)=> {

                    const collector = message.createMessageComponentCollector({componentType: ComponentType.StringSelect});
                    const GuildData = await prisma.guildData.findUnique({
                        where: {
                          guildId: message.guild.id,
                        },
                      });
                      
                      const PrefixData = await prisma.prefixData.findUnique({
                        where: {
                          guildId: message.guild.id,
                        },
                      });
                      
                      const TW47 = await prisma.twentyFourBySevenData.findUnique({
                        where: {
                          guildId: message.guild.id,
                        },
                      });

                      const PGuildData = await prisma.guildPremium.findFirst({where:{guildId:message.guild.id}});
                      
                      if (!GuildData || !PrefixData || !TW47) {
                        if (!GuildData) {
                          await prisma.guildData.create({
                            data: {
                              SearchEngine: 'ytsearch', 
                              guildId: message.guild.id,
                              AnnounceChannel: "0",
                              NpButtons: true,
                            },
                          });
                        }
                      
                        if (!PrefixData) {
                          await prisma.prefixData.create({
                            data: {
                              guildId: message.guild.id,
                              prefix: client.config.Dprefix,
                            },
                          });
                        }
                      
                        // if (!TW47) {
                        //   await prisma.twentyFourBySevenData.create({
                        //     data: {
                        //       guildId: message.guild.id,
                        //       status: false,
                        //       channel: '0',
                        //       message: '0',
                        //     },
                        //   });
                        // }
                      }
                      let Engine : string;
                    if(GuildData?.SearchEngine === 'ytsearch'){
                        Engine = 'DefaultEngine'
                    }else if(GuildData?.SearchEngine === 'ytmsearch'){
                        Engine = 'PremiumEngine'
                    }else if (GuildData?.SearchEngine === 'scsearch'){
                        Engine = 'SoundCloudEngine'
                    } else if(GuildData?.SearchEngine === 'spsearch'){
                        Engine = 'SpotifyEngine'
                    }
                    
                    
                    
                    

                        const GuildData_ = new EmbedBuilder()
                    .setAuthor({ name: "Muzox", iconURL: client.user.displayAvatarURL() })
                    .setFields(
                    {name: 'Premium :', value : `\`\`\`ts\n ${Engine}\`\`\``, inline: false},
                    {name : 'PremiumSince :', value : `\`\`\`ts\n ${PGuildData?.PremiumSince }\`\`\``, inline: false},
                    {name : 'PremiumExpires :', value : `\`\`\`ts\n ${PGuildData?.PremiumExpires}\`\`\``, inline: false},
                    {name : 'Tier :', value : `\`\`\`ts\n ${PGuildData?.PremiumGuildTier}\`\`\``, inline: false},
                    {name : 'PremiumSubscriptionCount', value : `\`\`\`ts\n ${PGuildData?.PremiumSubscriptionCount}\`\`\``, inline: false}
            
                    )
                    .setColor(Messages.Mconfigs.Ucolor)
                    ;
                    

                    const PrefixData_ = new EmbedBuilder()
                    .setAuthor({ name: "Muzox", iconURL: client.user.displayAvatarURL() })
                    .setFields(
                    {name: 'GuildId :', value : `\`\`\`ts\n ${PrefixData?.guildId}\`\`\``, inline: false},
                    {name : 'Prefix :', value : `\`\`\`ts\n ${PrefixData?.prefix}\`\`\``, inline: false},
                    )
                    .setColor(Messages.Mconfigs.Ucolor)
                    ;


                    const _24_7_Data_ = new EmbedBuilder()
                    .setAuthor({ name: "Muzox", iconURL: client.user.displayAvatarURL() })
                    .setFields(
                    {name : 'Tier :', value : `\`\`\`ts\n ${TW47?.guildId || message?.guild.id }\`\`\``, inline: false},
                    {name: '24/7 Active? :', value : `\`\`\`ts\n ${TW47?.status || 'False'}\`\`\``, inline: false},
                    {name : 'Channel Id :', value : `\`\`\`ts\n ${TW47?.channel ||'Inactive'}\`\`\``, inline: false},
                    {name : 'Announcement :', value : `\`\`\`ts\n ${TW47?.message || 'Inactive'}\`\`\``, inline: false},
            
                    )
                    .setColor(Messages.Mconfigs.Ucolor)
                    ;

                    collector.on("collect", async (collected : any) => {
                        const value = collected.values[0]
                    
                        if (value === "GuildData") {
                          collected.reply({ embeds: [GuildData_], ephemeral: true })
                        }
                        if (value === "PrefixData") {
                            collected.reply({ embeds: [PrefixData_], ephemeral: true })
                          }
                          if (value === "_24_7") {
                            collected.reply({ embeds: [_24_7_Data_], ephemeral: true })
                          }
                    
                        
                      })
                                  
                })

               



           
           
           
            
        
       
        
        
    } catch(e){
        Logger.log(e,"Error")
    }

    }
} 
