import { Client, Collection, Message } from 'discord.js';
import fs from 'fs';

import config from './config';
import { BotCommand } from './customInterfaces';

import readyListener from './listeners/readyListener';
import messageListener from './listeners/messageListener';

import { AudioPlayer } from './audio/audioPlayer';
import { MusicQueue } from './audio/musicQueue';

export class musicboiBot {
    // Discord Client of the Bot
    private _client: Client;

    // All available commands (in folder 'commands')
    private _commands: Collection<string, BotCommand>;

    // audioPlayer which manages the entire audio/song stuff
    private _audioPlayer: AudioPlayer;

    private _musicQueue: MusicQueue;

    // Listeners
    private _messageListener: messageListener;
    private _readyListener: readyListener;

    // initial start method
    public async start() {
        // create new client
        this._client = new Client();

        // create audioPlayer, logger and statusMessages
        // keep this order, else the code will throw runtime errors
        this._musicQueue = new MusicQueue(this);
        this._audioPlayer = new AudioPlayer(this);

        // create listnerers
        this._messageListener = new messageListener(this);
        this._readyListener = new readyListener(this);

        // load all commands
        this.loadCommands();

        // init event listeners
        this.initEvents();

        this._client.login(config.botToken);
    }

    /**
     * getters
     * 
     */
    public getClient() {
        return this._client;
    }
    public getAudioPlayer() {
        return this._audioPlayer;
    }
    public getMusicQueue() {
        return this._musicQueue;
    }
    public getAllCommands() {
        return this._commands;
    }

    // init event listeners
    private initEvents() {
        this._client.on('ready', async () => this._readyListener.evalReady());
        this._client.on('message', async (msg) => {
            if (msg.partial) return;
            this._messageListener.evalMessage(msg as Message);
        });
    }

    // load all commands
    private loadCommands() {
        this._commands = new Collection();
        const COMMANDFILES = fs.readdirSync(`${config.rootPath}/commands`).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

        for (const file of COMMANDFILES) {
            const COMMAND = require(`./commands/${file}`).default;
            const commandInstance = new COMMAND(this);
            this._commands.set(commandInstance.information.name.toLowerCase(), commandInstance);
        }
    }
}