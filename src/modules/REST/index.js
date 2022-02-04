import { ModuleBuilder } from 'waffle-manager';
import { EventEmitter } from 'events';
import ImportDir from '@yimura/import-dir'
import { resolve } from 'path'

export const ModuleInfo = new ModuleBuilder('REST')    
    .addEventListener('webserver', 'request', '_onRequest')
    .addRequired('webserver');

export const ModuleInstance = class extends EventEmitter {
    _cache = new Map();

    constructor(config) {
        super();

        this.config = config;
    }

    async _onRequest(request) {

        const instance = this._cache.get(request.url);
        if (!instance) {
            request.res.writeHead(404, { 'Content-Type': 'text/html' });
            request.res.end('<pre>404 - Not Found<br><br>The requested URL was not found on this server.</pre>');

            return;
        }

        const method = request.method;
        if (typeof instance[method] !== 'function') {
            request.res.writeHead(405, { 'Content-Type': 'text/html' });
            request.res.end('<pre>405 - Method Not Allowed<br><br>The given URL exists but an invalid request method was used.</pre>');

            return;
        }

        try {
            await instance[method](request);
        } catch (err) {
            request.res.writeHead(500, { 'Content-Type': 'text/plain' });
            if (this.config.development)
                request.res.end(err.stack);
            else
                request.res.end("An error occured, please contact an administrator if the problem persists.");

            console.log(`An error occured on "${request.url}":`, err);
        }
    }

        /**
     * Registers all of the files from under the API directory.
     * @param {Object} api
     */
    async _recursiveRegister(api, route = '/api') {
        console.log(api);
        for (const bit in api) {
            if (Object.hasOwnProperty.call(api, bit)) {
                const bits = api[bit];

                if (bits instanceof Promise) {
                    const instance = new (await api[bit]).default(this._m);

                    if (instance.disabled) {
                        console.log('REST', `Route disabled: ${route + instance.route}`);

                        continue;
                    }

                    this._cache.set(route + instance.route, instance);

                    continue;
                }

                await this._recursiveRegister(bits, `${route}/${bit}`);
            }
        }
    }

    //required for Modules.load() using waffle manager
    async init() {
        const api = ImportDir(resolve('./src/modules/REST/api/'), { recurse: true });
        await this._recursiveRegister(api);

        console.log(this._cache);
        return true;
    }

    //required for Modules.cleanup() using waffle manager
    async cleanup() {}

}