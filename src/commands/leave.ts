import { Message, Client } from 'discord.js';

import { BotCommand } from '../customInterfaces';
import { AudioPlayer } from '../audio/audioPlayer';
import { musicboiBot } from '../bot';

export default class leaveCommand implements BotCommand {
    public information: BotCommand['information'] = {
        id: 3,
        name: 'leave',
        category: 'Music',
        description: 'Leaves the voice channel and clears the queue.',
        argsRequired: false,
        admin: false,
        aliases: ['l', 'stop', 'disconnect'],
        usage: 'leave',
        examples: ['leave']
    }

    private _client: Client;

    private _audioPlayer: AudioPlayer;

    constructor(private _botClient: musicboiBot) {
        this._client = this._botClient.getClient();
        this._audioPlayer = this._botClient.getAudioPlayer();
    }

    public async execute(msg: Message, args: string[], prefix: string) {
        // check if bot is in a voice channel
        if (!msg.guild.member(this._client.user).voice.channel) {
            msg.channel.send(':no_entry_sign: I\'m not in a voice channel.');
        } else {
            // leave voice channel and clear queue
            this._audioPlayer.leave(msg);
        }
    }
}