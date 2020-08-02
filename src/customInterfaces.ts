import { Message } from 'discord.js';

/**
 * Every Bot Command
 */
export interface BotCommand {
    information: {
        id: number,
        name: string,
        category: string,
        description: string,
        argsRequired: boolean,
        admin: boolean,
        aliases: string[],
        usage: string,
        examples: string[]
    },
    afterInit?(): void,
    execute(msg: Message, args: string[], prefix: string): void
}

/**
 * General Config
 */
export interface BotConfig {
    pr1smGuildID: string,
    botOwnerID: string,
    botToken: string,
    prefix: string,
    botID: string,
    rootPath: string
}

/**
 * Song for song queue
 */
export interface QueueSong {
    name: string,
    requester: string,
    id: string,
    length: number
}