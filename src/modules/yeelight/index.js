import { ModuleBuilder } from 'waffle-manager';
import { Yeelight } from 'yeelight-node';
import { loadJson } from '@/src/util/Util.js';

export const ModuleInfo = new ModuleBuilder('yeelight');

export const ModuleInstance = class {
    constructor(main) {

        // default yeelight port
        this.default = {
            port: 55443
        };

        this.lightObjects = [];

        this.lights = loadJson('/data/yeelight.config.json').lights; // Path based on root of project
    }

    //required for Modules.load() using waffle manager
    async init() {
        console.log('yeelight initialized!');
        for (const light of this.lights) {
            // assign default port to light object
            let obj = Object.assign({}, this.default, light);
            this.lightObjects.push(new Yeelight(obj));
        }
        this.turnOnLights();
        return true;
    }

    //required for Modules.cleanup() using waffle manager
    async cleanup() {
        this.turnOffLights();
    }

    turnOnLights() {
        for (const light of this.lightObjects) {

            light.set_power('on');
            
        }
    }

    turnOffLights() {
        for (const light of this.lightObjects) {

            light.set_power('off');

        }
    }
}