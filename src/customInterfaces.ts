import { Client, Collection, Message } from 'discord.js';

import { Logger } from './messages/logger';
import { BotDatabase } from './database';
import { AudioPlayer } from './audio/audioPlayer';
import { StatusMessages } from './messages/statusMessages';
import { MusicQueue } from './audio/musicQueue';

/**
 * main client class
 */
export interface BotClient {
    getClient(): Client,
    getDatabase(): BotDatabase,
    getAllCommands(): Collection<string, BotCommand>,
    getAudioPlayer(): AudioPlayer,
    getLogger(): Logger,
    getStatusMessages(): StatusMessages,
    getMusicQueue(): MusicQueue,
    start(): void,
    afterInit(): void
}

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
    logChannelID: string,
    dashboardChannelID: string,
    textChannelID: string,
    nowPlayingMessageID: string,
    songLeaderboardMessageID: string,
    djLeaderboardMessageID: string,
    iboisGuildID: string,
    botOwnerID: string,
    botToken: string,
    prefix: string,
    botID: string,
    maxPlaylistSongs: number,
    rootPath: string,
    DBLogging: boolean
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