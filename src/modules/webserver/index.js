import { EventEmitter } from 'events';
import { ModuleBuilder } from 'waffle-manager';
import WebServer from './web/Server.js';

export const ModuleInfo = new ModuleBuilder('webserver');

export const ModuleInstance = class extends EventEmitter {

    constructor(config) {
        super();
        this.config = config;
        this._server = new WebServer(this.config.webserver);

    }

    //required for Modules.load() using waffle manager
    async init() {
        this._server.start();
        return true;
    }

    //required for Modules.cleanup() using waffle manager
    async cleanup() {
    }

}