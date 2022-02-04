import Modules from 'waffle-manager';
import { resolve } from 'path';
import { loadJson } from '@/src/util/Util.js';

export default class Main {

    constructor() {


        this.config = loadJson('/data/config.json'); // Path based on root of project
    }

    start() {
        Modules.load(this.config, resolve('./src/modules'));
    }

    async exit() {
        await Modules.cleanup();

        process.exit();
    }

}