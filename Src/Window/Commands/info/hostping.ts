import { Muzox, Queue, Logger, ContextManager, messageCommands, Messages, EmojisPacket } from '../../../Resources/modules/index.js';

export default <messageCommands>{
  data: {
    name: 'hostping',
    description: "check the bot's host ping/latency",
    vote: false,
    voice: false,
    queue: false,
    player: false,
    samevc: false,
    botconnection: false,
    permissions: ['SendMessages'],
    slash: true,
    SlashData: {
      Name: 'hostping',
      options: []
    },
  },
  execute: async (client: Muzox, message: ContextManager, args: string[]) => {
    try {
      if (message.CheckInteraction) {
        await message.setDeffered(false);
      }
      const timestamp = new Date().getTime();
      const msg = await message.reply('Pinging...');
      const userPing = new Date().getTime() - timestamp;

      msg.edit(`Host Ping : ${userPing}ms `);

    } catch (e) {
      Logger.log(e, "Error")
    }
  }
}