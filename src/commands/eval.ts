import { Message, Client } from 'discord.js';

import { BotCommand, BotClient } from '../customInterfaces';
import { Logger } from '../messages/logger';
import { BotDatabase } from '../database';

export default class leaveCommand implements BotCommand {
    public information: BotCommand['information'] = {
        id: 6,
        name: 'eval',
        category: 'Admin',
        description: 'Eval command.',
        argsRequired: true,
        admin: true,
        aliases: [],
        usage: 'eval {command}',
        examples: ['eval {msg.channel.send(\'test\')}']
    }

    private _client: Client;

    private _db: BotDatabase;

    private _logger: Logger;

    constructor(private _botClient: BotClient) {
        this._client = this._botClient.getClient();
        this._db = this._botClient.getDatabase();
        this._logger = this._botClient.getLogger();
    }

    public async execute(msg: Message, args: string[], prefix: string) {
        try {
            const code = args.join(' ');
            let evaled = await eval(code);

            if (typeof evaled !== 'string')
                evaled = require('util').inspect(evaled);


            this._logger.logEval(msg, args, true, '```xl\n' + this._clean(evaled) + '```');
        } catch (err) {
            this._logger.logEval(msg, args, false, '```xl\n' + this._clean(err) + '```');
        }
        await msg.delete();
    }

    private _clean(text: string): string {
        return typeof (text) === 'string' ? text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203)) : text;
    }

}