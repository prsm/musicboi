import { Message, Client } from 'discord.js';
import moment from 'moment';

import { BotCommand, QueueSong } from '../customInterfaces';
import { musicboiBot } from '../bot';
import { MusicQueue } from '../audio/musicQueue';

export default class queueCommand implements BotCommand {
    public information: BotCommand['information'] = {
        id: 11,
        name: 'queue',
        category: 'Music',
        description: 'Displays the current queue',
        argsRequired: false,
        admin: false,
        aliases: ['q'],
        usage: 'queue',
        examples: ['queue']
    }

    private _client: Client;

    private _musicQueue: MusicQueue;

    constructor(private _botClient: musicboiBot) {
        this._client = this._botClient.getClient();
        this._musicQueue = this._botClient.getMusicQueue();
    }

    public async execute(msg: Message, args: string[], prefix: string) {
        const queue = this._musicQueue.getQueue();
        if (queue.length === 0) {
            msg.channel.send('Nothing is playing.');
            return;
        }
        let playnowString = '';

        playnowString += `<:disc:678576065542750209> Now playing <:disc:678576065542750209>\n\n`;
        if (this._musicQueue.loop.enabled && !this._musicQueue.loop.entireQueue) {
            playnowString += `:repeat_one:`;
        }
        playnowString += `:dvd: **${queue[0].name}**\n`;
        playnowString += `https://youtu.be/${queue[0].id}\n\n`;

        const upcoming = this._generateQueueString(queue);

        msg.channel.send(playnowString);
        msg.channel.send(upcoming);
    }

    private _generateQueueString(queue: Array<QueueSong>) {
        let comingQueue = [...queue];
        comingQueue.shift();
        let duration = moment.duration(comingQueue.map((value) => value.length).reduce((a, b) => a + b, 0), 'seconds');
        let durationString = this._formatDuration(duration);
        let comingUpString = comingQueue.length > 0 ? `\n\n${this._musicQueue.loop.entireQueue ? ':repeat: ' : ''}**Coming up** | Total Duration: **${durationString}**\n` : '';

        if (comingQueue.length > 20) {
            for (let i = 0; i < 20; i++) {
                comingUpString += `\n▬ ${comingQueue[i].name} (**${this._formatDuration(moment.duration(comingQueue[i].length, 'seconds'))}**)`;
            }
            comingUpString += `\n\n+ ${comingQueue.length - 20} more...`;
        } else {
            for (let song of comingQueue) {
                comingUpString += `\n▬ ${song.name} (**${this._formatDuration(moment.duration(song.length, 'seconds'))}**)`;
            }
        }

        return comingUpString;
    }

    private _formatDuration(duration: moment.Duration): string {
        let formattedDuration = '';
        formattedDuration += duration.hours() > 0 ? `${duration.hours()}:` : '';
        formattedDuration += duration.hours() > 0 && duration.minutes() < 10 ? `0${duration.minutes()}:` : `${duration.minutes()}:`;
        formattedDuration += duration.seconds() > 9 ? duration.seconds() : `0${duration.seconds()}`;

        return formattedDuration;
    }

}