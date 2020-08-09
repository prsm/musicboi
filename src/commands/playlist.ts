import { Message, Client } from 'discord.js';
import * as ytdl from 'ytdl-core';
import ytpl from 'ytpl';

import { BotCommand, QueueSong } from '../customInterfaces';
import { AudioPlayer } from '../audio/audioPlayer';
import { musicboiBot } from '../bot';
import config from '../config';

export default class playlistCommand implements BotCommand {
    public information: BotCommand['information'] = {
        id: 12,
        name: 'playlist',
        category: 'Music',
        description: 'Load an entire youtube playlist into the queue. (Max. 100 songs)',
        argsRequired: true,
        admin: false,
        aliases: ['pl'],
        usage: 'playlist {youtube playlist link}',
        examples: ['playlist https://www.youtube.com/playlist?list=PLP0kESADYKNA4HLyruH7sldzJyvGyzSyE']
    }

    private _client: Client;

    private _audioPlayer: AudioPlayer;

    constructor(private _botClient: musicboiBot) {
        this._client = this._botClient.getClient();
        this._audioPlayer = this._botClient.getAudioPlayer();
    }

    public async execute(msg: Message, args: string[], prefix: string) {
        // check if user is in a voice channel
        if (!msg.member.voice.channel) {
            msg.channel.send(':no_entry_sign: Please join a voice channel.');

            // check if user and bot are in the same voice channel
        } else if (msg.guild.member(this._client.user).voice.channel && msg.guild.member(this._client.user).voice.channel !== msg.member.voice.channel) {
            msg.channel.send(`:no_entry_sign: You're not in the same voice channel as the bot.\n Use \`${prefix}leave\` to disconnect the bot.`);
        }

        if (!args[0]) {
            msg.channel.send(`:no_entry_sign: ${msg.author.toString()}, please provide a valid youtube playlist link/id.`);
            return;
        }
        if (!ytpl.validateURL(args[0])) {
            msg.channel.send(`:no_entry_sign: ${msg.author.toString()}, please provide a valid youtube playlist link/id.`);
            return;
        }

        const ytPlaylist = await ytpl(args[0], { limit: config.playlistSongLimit });

        msg.channel.send('Loading songs into the queue. This might take a bit...');

        for (const ytSong of ytPlaylist.items) {
            await ytdl.getBasicInfo(ytSong.id).then(info => {
                if (parseInt(info.videoDetails.lengthSeconds) > 39600) {
                    msg.channel.send(`:no_entry_sign: ${msg.author.toString()}, sorry, but the video "${info.title}" is longer than 11 hours. Get some help.`);
                    return;
                }
                if (!info.videoDetails.title || !info.videoDetails.lengthSeconds) {
                    msg.channel.send(`:no_entry_sign: ${msg.author.toString()}, youtube video with ID \`${ytSong.id}\` is not accessible. Maybe private?`);
                    return;
                }
                if (parseInt(info.videoDetails.lengthSeconds) === 0) {
                    msg.channel.send(`:no_entry_sign: ${msg.author.toString()}, youtube video with ID \`${ytSong.id}\` is a stream.`);
                    return;
                }
                const song: QueueSong = { name: info.videoDetails.title, requester: msg.author.id, id: info.videoDetails.videoId, length: parseInt(info.videoDetails.lengthSeconds) };
                this._audioPlayer.addVideo(msg.member.voice.channel, song);
            }).catch(err => {
                msg.channel.send(`:no_entry_sign: ${msg.author.toString()}, youtube video \`${ytSong.title}\`, ID: \`${ytSong.id}\` not found. Might got deleted or blocked.`);
                return;
            });
        }
        msg.channel.send(`Finished! (You can check the queue with ${prefix}queue)`);
    }
}