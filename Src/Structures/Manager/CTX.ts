import { CommandInteraction, GuildMemberResolvable, Message, APIInteractionGuildMember, Guild, GuildMember, TextChannel, User, PartialDMChannel, GuildTextBasedChannel, DMChannel, BaseChannel } from 'discord.js';
import { Muzox } from '../../Resources/modules/index.js';

export default class ContextManager {
  public ctx: CommandInteraction | Message;
  public CheckInteraction: boolean;
  public interaction: CommandInteraction | null;
  public message: Message | null;
  public id: string;
  public channelId: string;
  public client: Muzox;
  public author: User | null;
  public channel: PartialDMChannel | GuildTextBasedChannel | TextChannel | DMChannel | any | null = null;
  public guild: Guild | null;
  public createdAt: Date;
  public createdTimestamp: number;
  public member: GuildMemberResolvable | GuildMember | APIInteractionGuildMember | null;
  public args: any[];
  public msg: any;
  public parameters: any;
  public mentionedUsers: any;
  constructor(ctx, args) {
    this.ctx = ctx;
    this.CheckInteraction = ctx instanceof CommandInteraction;
    this.interaction = this.CheckInteraction ? ctx : null;
    this.message = this.CheckInteraction ? null : ctx;
    this.id = ctx.id;
    this.channelId = ctx.channelId;
    this.client = ctx.client;
    this.author = ctx instanceof Message ? ctx.author : ctx.user;
    this.channel = ctx.channel;
    this.guild = ctx.guild;
    this.createdAt = ctx.createdAt;
    this.createdTimestamp = ctx.createdTimestamp;
    this.member = ctx.member;
    this.mentionedUsers = this.message?.mentions?.users?.first() || 'null';
    this.setArgs(args);
    if (this.mentionedUsers === 'null') {
      //console.log('no user mentioned')
      this.mentionedUsers = null;
    }
  }
  setArgs(args: any[] | any) {
    if (this.CheckInteraction) {
      try {
        this.args = args.map((arg: { value: any }) => arg.value);
      } catch (err) {
        this.args = args;
      }

    } else {
      this.args = args;
    }
  }

  // public async PermissionManager(){
  //   if(this.CheckInteraction){
  //     let x;
  //     this.ctx.channel.permissionsFor()

  //   }
  // }
  public async GetUsers(x?: string | null, ArgsIndex?: number | null) {
    let FinalValues;
    if (this.CheckInteraction) {
      FinalValues = this.interaction.options.get(x)?.value;
      return;
    } else {

      let c: any = ArgsIndex;
      if (!c) c = 0;
      const value = this.message?.mentions?.users?.first()?.id || this.args.slice(c as any).join(' ') || null;
      FinalValues = value;
      return FinalValues;
    }
  };
  public async Options(x?: string,channelinstance?:boolean) {
    if (this.CheckInteraction) {
      this.parameters = this.interaction.options.get(x)?.value;
      return this.interaction.options.get(x)?.value;
    } else {
      if(!channelinstance ){
        this.parameters = this.args.slice(0).join(' ');
      return this.args.slice(0).join(' ');
      } else if(channelinstance) {
        this.parameters = this.args.slice(0).join(' ');
        //return this.args.slice(0).join(' ');
        const c :any = this.message.guild.channels.cache.get(this.parameters) 
        || 
        this.message.guild.channels.cache.find((c)=>c.name.toLowerCase().includes(this.parameters.toLowerCase()))
        ||
        this.message.guild.channels.cache.get(this.parameters.replace('<#','').replace('>',''))
        let ri = c;
        if(!isNaN(c)) ri = c.id;
        return ri;
      }
      
    }

  }

  public async setDeffered(ephemeral: boolean) {
    if (!ephemeral) {
      ephemeral = false;
    }
    if (this.CheckInteraction) {
      const DeferManager = this.interaction.deferReply({ ephemeral: ephemeral });
      return DeferManager;
    }
  }
  public async reply(content: any) {
    // console.log('replying')

    if (this.CheckInteraction) {
      this.msg = this.interaction.editReply(content);
      return this.msg;
    } else {
      this.msg = await this.message.reply(content);
      return this.msg;
    }
  }

  public async react(content: any) {
    if (this.CheckInteraction) {
      let fetch = this.interaction.fetchReply();
      this.msg = (await fetch).react(content);

      return this.msg;
    } else {
      this.msg = await this.message.react(content);
      return this.msg;
    }
  }
  public async send(content) {
    if (this.CheckInteraction) {
      this.msg = this.interaction.channel.send(content);
      return this.msg;
    } else {
      this.msg = await (this.message.channel as TextChannel).send(content);
      return this.msg;
    }
  }
  public async edit(content) {
    if (this.CheckInteraction) {
      if (this.msg) this.msg = await this.interaction.editReply(content);
      return this.msg;
    } else {
      if (this.msg) this.msg = await this.msg.edit(content);
      return this.msg;
    }
  }
  public async Dsend(content) {
    if (this.CheckInteraction) {
      this.msg = await this.interaction.deferReply({ fetchReply: true });
      return this.msg;
    } else {
      this.msg = await (this.message.channel as TextChannel).send(content);
      return this.msg;
    }
  }
  public async sendFollowUp(content) {
    if (this.CheckInteraction) {
      await this.interaction.followUp(content);
    } else {
      this.msg = await (this.message.channel as TextChannel).send(content);
    }
  }
  public get deferred() {
    if (this.CheckInteraction) {
      return this.interaction.deferred;
    }
    if (this.msg) return true;
    return false;
  }
}


/**
 * 💬 send : message.channel.send ? interaction.channel.send
 * 📝 edit : message.edit ? interaction.editReply
 * 📝 Dsend : message.channel.send ? interaction.deferReply
 * 📝 sendFollowUp : message.channel.send ? interaction.followUp
 * 📝 deferred : message.channel.send ? interaction.deferred
 * 
 */