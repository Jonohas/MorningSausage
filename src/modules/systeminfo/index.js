import { ModuleBuilder } from 'waffle-manager';
import si from 'systeminformation';

const name = 'systeminfo';

export const ModuleInfo = new ModuleBuilder(name);

export const ModuleInstance = class {
    constructor(main) {
        this.config = main.config;
        this.log = main.log;
    }

    //required for Modules.load() using waffle manager
    async init() {
        this.log.info(name.toUpperCase(), `Starting ${name}...`);
        return true;
    }

    //required for Modules.cleanup() using waffle manager
    async cleanup() {}

}