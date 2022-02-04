import { ModuleBuilder } from 'waffle-manager';
import { Yeelight } from 'yeelight-node';

const name = 'yeelight';

export const ModuleInfo = new ModuleBuilder(name);

export const ModuleInstance = class {
    constructor(main) {

        // default yeelight port
        this.default = {
            port: 55443
        };

        this.lightObjects = [];


        this.config = main.config.yeelight;
        this.logger = main.log;
    }

    //required for Modules.load() using waffle manager
    async init() {
        this.logger.info(name.toUpperCase(), `Starting ${name}...`);

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