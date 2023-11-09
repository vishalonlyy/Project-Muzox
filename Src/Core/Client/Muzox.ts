import { Guild, Options, Awaitable, EmbedBuilder } from 'discord.js';
import { readdirSync } from 'fs';
import { ClientOptions_, Logger, Muzox, LoadSlash, LoadCommands, Messages } from '../../Resources/modules/index.js'
import { getInfo } from "discord-hybrid-sharding";
import moment from 'moment';
const Muzox_Client = new Muzox({
  shards: getInfo().SHARD_LIST,
  shardCount: getInfo().TOTAL_SHARDS,
  intents: ClientOptions_.Intents,
  makeCache: Options.cacheWithLimits({
    ...Options.DefaultMakeCacheSettings,
  }),
  allowedMentions: {
    repliedUser: false,
    parse: ["everyone", "users", "roles"]
  }
})


Muzox_Client.rest.on('restDebug', (info)=> {
  //Logger.log(`: RestDebug :: ${info}`, "[RestDebug]")
})

Muzox_Client.rest.on('rateLimit', (rateLimitData) => {
  Logger.log(`: RateLimit :: ${rateLimitData}`, "[RateLimit]")
})


Muzox_Client.on('shardReady', (shardId: number, unavailableGuilds: Set<string>) => {
  const ShardLogs: any = Muzox_Client.channels.cache.get(Muzox_Client.config.shardLogs)
  Logger.log(`: Ready #${shardId}`, "[Shard]")
  if (Muzox_Client.config.logs === true) { ShardLogs.send(`\`\`\`ts\n 🟢 Shards #${shardId} Ready\`\`\``) }
})
Muzox_Client.on('shardReconnecting', (shardId: number) => {
  const shardAlerts: any = Muzox_Client.channels.cache.get(Muzox_Client.config.shardAlerts)
  Logger.log(`: Reconnecting #${shardId}`, "[Shard]")
  if (Muzox_Client.config.logs === true) { shardAlerts.send(`\`\`\`ts\n🟠 ShardReconnecting #${shardId}\`\`\``) }
})
Muzox_Client.on('shardError', (error: Error, shardId: number): Awaitable<void> => {
  const shardAlerts: any = Muzox_Client.channels.cache.get(Muzox_Client.config.shardAlerts)
  Logger.log(`: Error #${shardId} \n : Reason :: ${error}`, "[ShardError]")
  if (Muzox_Client.config.logs === true) { shardAlerts.send(`\`\`\`ts\n🔴 ShardError #${shardId}\`\`\``) }
})
Muzox_Client.on('shardResume', (shardId: number, replayedEvents: number) => {
  const shardAlerts: any = Muzox_Client.channels.cache.get(Muzox_Client.config.shardAlerts)
  Logger.log(`: Resumed #${shardId} :: ReplayedEvents : ${replayedEvents}`, "[Shard]")
  if (Muzox_Client.config.logs === true) { shardAlerts.send(`\`\`\`ts\n🟢 ShardResumed #${shardId}\`\`\``) }
})
Muzox_Client.on('guildCreate', async (guild: Guild) => {
  const channel: any = Muzox_Client.channels.cache.get(Muzox_Client.config.guildLogs)
  let own = await guild.fetchOwner()
  const GuildCreatedEmbed = new EmbedBuilder()
    .setTitle('🟢 Guild Connected 🟢')
    .addFields({ name: `Guild`, value: `\`\`\`ts\n${guild.name} || ${guild.id}\`\`\`` }, { name: `Data`, value: `\`\`\`ts\nMembersCount : ${guild.memberCount} | ${moment.utc(guild.createdAt).format('DD/MMM/YYYY')}\`\`\`` },
      { name: `Owner`, value: `\`\`\`ts\n ${guild.members.cache.get(own.id) ? guild.members.cache.get(own.id).user.tag : "Unknown user"} | ${guild.ownerId}\`\`\`` }, { name: 'server Count ', value: `\`\`\`ts\n${Muzox_Client.guilds.cache.size} Servers\`\`\`` })
    .setColor(Messages.Mconfigs.Ucolor)
    .setTimestamp()
    .setThumbnail(guild.iconURL({ size: 1024 }))
  channel.send({ embeds: [GuildCreatedEmbed] })
})
Muzox_Client.on('guildDelete', (guild: Guild) => {
  const channel: any = Muzox_Client.channels.cache.get(Muzox_Client.config.guildLogs)
  const DeletedGuild = new EmbedBuilder()
    .setTitle('🔴Guild Disconnected 🔴')
    .addFields({ name: `Guild Data`, value: `\`\`\`ts\n ${guild.name}\`\`\`` }, { name: 'MembersCount', value: `\`\`\`ts\n ${guild.memberCount}\`\`\`` }, { name: 'Servers in✨', value: `\`\`\`ts\n ${Muzox_Client.guilds.cache.size} Servers\`\`\`` })
    .setThumbnail(guild.iconURL({ size: 1024 }))
    .setTimestamp()
    .setColor(Messages.Mconfigs.Ecolor)
  channel.send({ embeds: [DeletedGuild] })
})
//LoadMessageEvents(Muzox_Client);
LoadSlash(Muzox_Client);
LoadCommands(Muzox_Client);
async function _LoadVoice() {
  const eventFiles = readdirSync('./dist/Core/Player/Player').filter(file => file.endsWith('.js'));
  // Register each event file with Shoukaku
  for (const file of eventFiles) {
    const eventModule = await import(`../Player/Player/${file}`);
    const event = eventModule.default;
    event(Muzox_Client.shoukaku);
  }
}
_LoadVoice()
export { Muzox_Client }
Muzox_Client.loginBot(process.env.Token)