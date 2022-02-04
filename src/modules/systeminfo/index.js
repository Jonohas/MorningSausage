import { ModuleBuilder } from 'waffle-manager';
import si from 'systeminformation';

export const ModuleInfo = new ModuleBuilder('systeminfo');

export const ModuleInstance = class {
    constructor(main) {

    }

    //required for Modules.load() using waffle manager
    async init() {
        console.log('systeminfo initialized!');
        console.log(await si.battery());
        return true;
    }

    //required for Modules.cleanup() using waffle manager
    async cleanup() {
        console.log('aaaaa');
    }

}