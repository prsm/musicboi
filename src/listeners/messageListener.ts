import { Message, Client } from 'discord.js';

import { musicboiBot } from '../bot';
import config from '../config';

export default class messageListener {

    private _client: Client;

    private _prefix: string;

    constructor(private _botClient: musicboiBot) {
        this._client = this._botClient.getClient();

        // get prefix from config
        this._prefix = config.prefix;
    }

    public async evalMessage(msg: Message) {

        // return if msg is from bot or not sent in a guild
        if (msg.author.bot || !msg.guild) return;

        if (msg.content.startsWith(`<@${this._client.user.id}>`) || msg.content.startsWith(`<@!${this._client.user.id}`)) {
            msg.channel.send(`My prefix on this server is \`${this._prefix}\`\nGet a list of commands with \`${this._prefix}help\``);
            return;
        }

        if (!msg.content.toLowerCase().startsWith(this._prefix.toLowerCase())) return;

        let args = msg.content.slice(this._prefix.length).split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = this._botClient.getAllCommands().get(commandName) || this._botClient.getAllCommands().find(cmd => cmd.information.aliases && cmd.information.aliases.includes(commandName));

        // return if no command was found.
        if (!command) return;

        if (command.information.admin && !(msg.author.id === config.botOwnerID)) {
            msg.channel.send(`:no_entry_sign: Only an Admin can execute this command.`);
            return;
        }

        if (command.information.argsRequired && !args.length) {
            let reply = `:no_entry_sign: No arguments were provided`

            reply += `\nUsage: \`${this._prefix}${command.information.usage}\``

            reply += `\nExample:`;

            for (let example of command.information.examples) {
                reply += `\n\`${this._prefix}${example}\``;
            }
            msg.channel.send(reply);
            return;
        }

        try {
            command.execute(msg, args, this._prefix);
        } catch (error) {
            console.error(error);
            msg.channel.send(`Error...`);
        }
    }
}