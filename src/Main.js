import Modules from 'waffle-manager';
import { Logger } from './util/Logger.js'
import { resolve } from 'path';
import { loadJson } from '@/src/util/Util.js';

export default class Main {

    constructor() {


        this.config = loadJson('/data/config.json'); // Path based on root of project
        this.auth = loadJson('/data/auth.json');
        Object.assign(this.config, this.auth);
    }

    get log() {
        return Logger;
    }

    start() {
        
        Modules.load(this, resolve('./src/modules'));
    }

    async exit() {
        this.log.info('MAIN', 'Stopping application...');

        await Modules.cleanup();

        process.exit();
    }

}