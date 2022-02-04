import http from 'http';
import { EventEmitter } from 'events';
import { ModuleBuilder } from 'waffle-manager';
import Request from './web/Request.js';

export const ModuleInfo = new ModuleBuilder('webserver');

export const ModuleInstance = class extends EventEmitter {

    constructor(config) {
        super();

        this.config = config.webserver;
        this._ = http.createServer();
    }

    getHeaders(req) {
        return {
            'Access-Control-Allow-Credentials': false,
            'Access-Control-Allow-Headers': this.config.allow_headers.reduce(reduceFun, ''),
            'Access-Control-Allow-Methods': this.config.allow_methods.reduce(reduceFun, ''),
            'Access-Control-Allow-origin': this._matchOrigin(req.headers.origin)
        }
    }

    _onRequest(req, res) {
        this.emit('request', new Request(this, req, res));
    }

    _onError(err) {
        this.emit('error', err)
    }

    _onListening() {
        this.emit('ready');
    }
    
    _handlePreflight(req, res) {
        const method = req?.method.toLowerCase();

        if (method === 'options') {
            res.writeHead(204, this.getHeaders(req));
            res.end();

            return true;
        }
        return false;
    }

    _matchOrigin(origin) {
        if (this.config.origins.includes(origin)) return origin;
        return this.config.origins[0];
    }

    //required for Modules.load() using waffle manager
    async init() {
        this._.on('request', this._onRequest.bind(this));
        this._.on('error', this._onError.bind(this));
        this._.on('listening', this._onListening.bind(this));

        this._.listen(this.config.port);

        return true;
    }

    //required for Modules.cleanup() using waffle manager
    async cleanup() {}

}

const reduceFun = (accum, value) => accum !== '' ? accum += ',' + value : accum = value;