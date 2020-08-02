import { Message, Client } from 'discord.js';
import * as ytdl from 'ytdl-core';

import { BotCommand, QueueSong } from '../customInterfaces';
import { AudioPlayer } from '../audio/audioPlayer';
import { musicboiBot } from '../bot';

export default class playNowCommand implements BotCommand {
    public information: BotCommand['information'] = {
        id: 10,
        name: 'playnow',
        category: 'Music',
        description: 'Play any youtube song. (At first place of queue)',
        argsRequired: true,
        admin: false,
        aliases: ['pn'],
        usage: 'playnow {youtube link}',
        examples: ['playnow https://youtu.be/GMb02tAqDRM']
    }

    private _client: Client;

    private _audioPlayer: AudioPlayer;

    constructor(private _botClient: musicboiBot) {
        this._client = this._botClient.getClient();
        this._audioPlayer = this._botClient.getAudioPlayer();
    }

    public async execute(msg: Message, args: string[], prefix: string) {

        // create regex of youtube link
        let videoRegex = args[0].match(/(youtu\.be\/|youtube\.com\/(watch\?(.*&)?v=|(embed|v)\/))([^\?&"'>]+)/);
        let videoID: string;
        // check if user is in a voice channel
        if (!msg.member.voice.channel) {

            msg.channel.send(':no_entry_sign: Please join a voice channel.');

            // check if user and bot are in the same voice channel
        } else if (msg.guild.member(this._client.user).voice.channel && msg.guild.member(this._client.user).voice.channel !== msg.member.voice.channel) {
            msg.channel.send(`:no_entry_sign: You're not in the same voice channel as the bot.\n Use \`${prefix}leave\` to disconnect the bot.`);

            // if youtube regex is isvalid
        } else if (!videoRegex) {
            msg.channel.send(':no_entry_sign: Please provide a valid youtube link.');
        } else {
            videoID = videoRegex[5];
            // if regex conatins a videoID
            if (videoID) {
                await msg.react('🔎');
                ytdl.getBasicInfo(videoID).then(info => {
                    if (parseInt(info.length_seconds) > 39600) {
                        msg.channel.send(':no_entry_sign: Sorry, but this fucking video is longer than 11 hours. Get some help.');
                        return;
                    }
                    if (!info.title) {
                        msg.channel.send(`:no_entry_sign: ${msg.author.toString()}, youtube video with ID \`${videoID}\` is not accessible. Maybe private?`);
                        return;
                    }
                    if (parseInt(info.length_seconds) === 0) {
                        msg.channel.send(`:no_entry_sign: I can't play streams.`);
                        return;
                    }
                    const song: QueueSong = { name: info.title, requester: msg.author.id, id: info.video_id, length: parseInt(info.length_seconds) };
                    this._audioPlayer.addVideoNow(msg.member.voice.channel, song);
                    msg.channel.send(`Added **${song.name}** to the queue.`);
                }).catch(err => {
                    msg.channel.send(':no_entry_sign: Youtube video not found.');
                    return;
                });
            } else {
                msg.channel.send(':no_entry_sign: Please provide a valid youtube link.');
            }
        }
    }
}