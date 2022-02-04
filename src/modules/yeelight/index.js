import { ModuleBuilder } from 'waffle-manager';
import { Yeelight } from 'yeelight-node';

export const ModuleInfo = new ModuleBuilder('yeelight');

export const ModuleInstance = class {
    constructor(config) {

        // default yeelight port
        this.default = {
            port: 55443
        };

        this.lightObjects = [];


        this.config = config.yeelight;
    }

    //required for Modules.load() using waffle manager
    async init() {
        for (const light of this.config.lights) {
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