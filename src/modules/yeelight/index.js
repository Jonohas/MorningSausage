import { ModuleBuilder } from 'waffle-manager';
import { Yeelight } from 'yeelight-node';

export const ModuleInfo = new ModuleBuilder('yeelight');

export const ModuleInstance = class CommandHandler {
    constructor(main) {
        this.yeelight = new Yeelight({ ip: '192.168.0.14', port: 55443 })
    }

    async init() {
        console.log('yeelight initialized!');
        this.turnOnLights();
        return true;
    }

    async cleanup() {
        this.turnOffLights();
    }

    turnOnLights() {
        this.yeelight.set_power('on');
    }

    turnOffLights() {
        this.yeelight.set_power('off');
    }
}