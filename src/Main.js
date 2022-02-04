import Modules from 'waffle-manager';
import log from './util/Log.js'
import { resolve } from 'path';
import { loadJson } from '@/src/util/Util.js';

export default class Main {

    constructor() {


        this.config = loadJson('/data/config.json'); // Path based on root of project
    }

    get log() {
        return log;
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