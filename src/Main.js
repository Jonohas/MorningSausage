import Modules from 'waffle-manager';
import { resolve } from 'path';

export default class Main {

    constructor() {

    }

    start() {
        Modules.load(this, resolve('./src/modules'));
        console.log('Main started!');
    }

    async exit() {
        console.log('Main exited!');
        await Modules.cleanup();

        process.exit();
    }

}