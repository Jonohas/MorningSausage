import { ModuleBuilder } from 'waffle-manager';
import { EventEmitter } from 'events';
import ImportDir from '@yimura/import-dir'
import { resolve } from 'path'

const name = 'REST';

export const ModuleInfo = new ModuleBuilder(name)    
    .addEventListener('webserver', 'request', '_onRequest')
    .addRequired('webserver');

export const ModuleInstance = class extends EventEmitter {
    _cache = new Map();

    constructor(main) {
        super();

        this.config = main.config;

        this.main = main;
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

            this.log.error(name.toUpperCase(), `An error occured on "${request.url}":`, err);
        }
    }

        /**
     * Registers all of the files from under the API directory.
     * @param {Object} api
     */
    async _recursiveRegister(api, route = '/api') {
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
        this.main.log.info(name.toUpperCase(), `Starting ${name}...`);

        const api = ImportDir(resolve('./src/modules/REST/api/'), { recurse: true });
        await this._recursiveRegister(api);

        this.main.log.verbose('REST', 'Registered all routes:', this._cache);
        return true;
    }

    //required for Modules.cleanup() using waffle manager
    async cleanup() {}

}