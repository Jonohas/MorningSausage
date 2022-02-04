import { ModuleBuilder } from 'waffle-manager';
import { EventEmitter } from 'events';

export const ModuleInfo = new ModuleBuilder('REST')    
    .addEventListener('webserver', 'request', '_onRequest')
    .addRequired('webserver');

export const ModuleInstance = class extends EventEmitter {
    constructor(main) {
        super();

    }

    _onRequest(request) {
        console.log('event request');
        //request.res.writeHead(200, { 'Content-Type': 'text/html' }); 
        
        // set response content    
        //request.res.write('<html><body><p>This is home Page.</p></body></html>');
        //request.res.end();
    }
    //required for Modules.load() using waffle manager
    async init() {
        console.log('rest initialized!');
        return true;
    }

    //required for Modules.cleanup() using waffle manager
    async cleanup() {
        console.log('aaaaa');
    }

}