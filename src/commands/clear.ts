import { Message, Client } from 'discord.js';

import { BotCommand } from '../customInterfaces';
import { MusicQueue } from '../audio/musicQueue';
import { musicboiBot } from '../bot';

export default class clearCommand implements BotCommand {
    public information: BotCommand['information'] = {
        id: 8,
        name: 'clear',
        category: 'Music',
        description: 'Clears the entire queue.',
        argsRequired: false,
        admin: false,
        aliases: ['clearQueue'],
        usage: 'clear',
        examples: ['clear']
    }

    private _client: Client;

    private _musicQueue: MusicQueue;

    constructor(private _botClient: musicboiBot) {
        this._client = this._botClient.getClient();
        this._musicQueue = this._botClient.getMusicQueue();
    }

    public async execute(msg: Message, args: string[], prefix: string) {
        // check if bot is in a voice channel
        if (!msg.guild.member(this._client.user).voice.channel || this._musicQueue.getQueue().length === 0) {
            msg.channel.send(`:no_entry_sign: I'm not playing anything.`);
            // check if bot and user are in the same voice channel
        } else if (msg.guild.member(this._client.user).voice.channel && msg.guild.member(this._client.user).voice.channel !== msg.member.voice.channel) {
            msg.channel.send(`:no_entry_sign: You're not in the same voice channel as the bot.\n Use \`${prefix}leave\` to disconnect the bot.`);
        } else {
            this._musicQueue.clearUpcomingQueue();
            msg.channel.send('Cleared queue.');
        }
    }
}