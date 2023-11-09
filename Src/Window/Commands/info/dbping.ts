import { Muzox, Queue, Logger, ContextManager, messageCommands, Messages, EmojisPacket } from '../../../Resources/modules/index.js';
import { PrismaClient } from '@prisma/client';

export default <messageCommands>{
  data: {
    name: 'dbping',
    description: "check the bot's database ping/latency",
    vote: false,
    voice: false,
    queue: false,
    player: false,
    samevc: false,
    botconnection: false,
    permissions: ['SendMessages'],
    slash: true,
    SlashData: {
        Name: 'dbping',
        options: []
      },
  },
  execute: async (client: Muzox, message: ContextManager, args: string[]) => {
    try {
      if(message.CheckInteraction){
        await message.setDeffered(false);
    }
      const prisma = new PrismaClient();
      const start = Date.now();
      await prisma.$connect();
      const end = Date.now();
      const responseTime = end - start;
      await prisma.$disconnect();
      message.reply(`\`\`\`ts\nDatabase ping successful. Response time: ${responseTime}ms\`\`\``);
    } catch (e) {
      Logger.log(e,"Error")
    } 
  }
}