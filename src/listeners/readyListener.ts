import { musicboiBot } from "../bot";

export default class readyListener {

    constructor(private _botClient: musicboiBot) { }

    public async evalReady() {
        console.log(`Logged in as ${this._botClient.getClient().user.tag}`);
    }
}