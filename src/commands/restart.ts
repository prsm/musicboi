import { Message, Client } from 'discord.js';

import { BotCommand } from '../customInterfaces';
import { musicboiBot } from '../bot';

export default class restartCommand implements BotCommand {
    public information: BotCommand['information'] = {
        id: 5,
        name: 'restart',
        category: 'Admin',
        description: 'Gracefully restarts the bot.',
        argsRequired: false,
        admin: true,
        aliases: [],
        usage: 'restart',
        examples: ['restart']
    }

    private _client: Client;

    constructor(private _botClient: musicboiBot) {
        this._client = this._botClient.getClient();
    }

    public async execute(msg: Message, args: string[], prefix: string) {
        await msg.channel.send('restarting...');
        this._client.destroy();
        process.exit();
    }

}