import { Message, Client, MessageEmbed, version } from 'discord.js';
import moment from 'moment';

import { musicboiBot } from '../bot';
import { BotCommand } from '../customInterfaces';

export default class statsCommand implements BotCommand {
    public information: BotCommand['information'] = {
        id: 6,
        name: 'stats',
        category: 'Information',
        description: 'Some noice stats.',
        argsRequired: false,
        admin: false,
        aliases: [],
        usage: 'stats',
        examples: ['stats']
    }

    private _client: Client;

    constructor(private _botClient: musicboiBot) {
        this._client = this._botClient.getClient();
    }

    public async execute(msg: Message, args: string[]) {
        const statEmbed = new MessageEmbed();
        statEmbed.setColor(0xEDD5BD);
        statEmbed.setAuthor(`${this._client.user.username}`, `${this._client.user.avatarURL()}`);
        statEmbed.setTitle(`:part_alternation_mark: Stats`);

        statEmbed.addField(`:stopwatch: Uptime`, `${this.formatTime(process.uptime())}`, true);

        statEmbed.addField(`<:djs:678576065601339402>Discord.js Version`, `v${version}`, true);
        statEmbed.addField(`<:nodejs:678576065479704586>Node.js Version`, `${process.version}`, true);
        statEmbed.addField(`:minidisc: Used memory`, `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} mb`, true);

        msg.channel.send({ embed: statEmbed });
    };

    formatTime(seconds: number) {
        let uptime = moment.duration(seconds, 'seconds');
        return (Math.floor(uptime.asMonths()) > 0 ? `${Math.floor(uptime.asMonths())}M ` : '') +
            (Math.floor(uptime.asMonths()) > 0 || uptime.days() > 0 ? `${uptime.days()}d ` : '') +
            (uptime.hours() > 0 || uptime.days() > 0 || Math.floor(uptime.asMonths()) > 0 ? `${uptime.hours()}h ` : '') +
            (uptime.minutes() > 0 || uptime.hours() > 0 || uptime.days() > 0 || Math.floor(uptime.asMonths()) > 0 ? `${uptime.minutes()}m ` : '') +
            (uptime.seconds() >= 10 ? `${uptime.seconds()}s ` : `${uptime.seconds()}s`);
    };
}