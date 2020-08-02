import { Message, Collection, MessageEmbed, Client } from 'discord.js';

import { BotCommand } from '../customInterfaces';
import config from '../config';
import { musicboiBot } from '../bot';

export default class helpCommand implements BotCommand {
    public information: BotCommand['information'] = {
        id: 0,
        name: 'help',
        category: 'Information',
        description: 'Displays all available commands.',
        argsRequired: false,
        admin: false,
        aliases: ['h'],
        usage: 'help',
        examples: ['help', 'help addEvent']
    }

    private _client: Client;

    private _commands: Collection<string, BotCommand>;

    constructor(private _botClient: musicboiBot) {
        this._client = this._botClient.getClient();
        this._commands = this._botClient.getAllCommands();
    }

    public execute(msg: Message, args: string[], prefix: string) {
        // set up embed
        let embed = new MessageEmbed();
        embed.setColor(0xEDD5BD);
        embed.setAuthor(`${this._client.user.username}`, `${this._client.user.avatarURL()}`);

        // search for a command to display help for
        const command = this._commands.get(args[0]) || this._commands.find(cmd => cmd.information.aliases && cmd.information.aliases.includes(args[0]));

        // if a command was found, set up help message for it
        if (command) {
            embed.setTitle(`Commandinfo \`${command.information.name}\``);
            embed.addField(`Description`, `${command.information.description}`);
            embed.addField(`Category`, `${command.information.category}`);
            if (command.information.aliases.length > 0) {
                let aliases: string;
                for (let alias of command.information.aliases) {
                    if (aliases) {
                        aliases += `, \`${alias}\``;
                    } else {
                        aliases = `\`${alias}\``;
                    }
                }
                embed.addField(`Aliases`, `${aliases}`);
            }
            embed.addField(`Usage`, `\`${prefix}${command.information.usage}\``);
            if (command.information.examples) {
                let examples: string;
                for (let example of command.information.examples) {
                    if (examples) {
                        examples += `\n\`${prefix}${example}\``;
                    } else {
                        examples = `\`${prefix}${example}\``;
                    }
                }
                embed.addField(`Example`, `${examples}`);
            }

            // send help message to log channel
            msg.channel.send({ embed });
        } else if (args[0]) {
            // if no command was found, send error message
            msg.channel.send(`:no_entry_sign: ${msg.author.toString()}, the command \`${args[0]}\` was not found.`);
        } else {
            // set up general help message
            embed.setTitle(`Commands`);
            embed.setDescription(`To get detailed information about a command, type \`${prefix}help {command}\``);
            let fields: {
                [key: string]: string
            } = {};
            for (const command of this._commands) {
                if (fields[`${command[1].information.category}`]) {
                    fields[`${command[1].information.category}`] += `\n**${prefix}${command[1].information.name}**\n${command[1].information.description}`;
                } else {
                    fields[`${command[1].information.category}`] = `**${prefix}${command[1].information.name}**\n${command[1].information.description}`;
                }
            }

            for (const key in fields) {
                embed.addField(`►${key}◄`, fields[key]);
            }
            msg.channel.send({ embed });
        }
    }
}