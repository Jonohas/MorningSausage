import { ModuleBuilder } from 'waffle-manager';
import { Octokit } from '@octokit/rest';

const name = 'git_sync';

export const ModuleInfo = new ModuleBuilder(name);

export const ModuleInstance = class {
    constructor(main) {
        this.config = main.config;
        this.log = main.log;

        this.octokit = new Octokit({ auth: this.config.github_pat});
        this.repos = [];
    }

    async getRepos(page){
        const reponse = await this.octokit.request('GET /user/repos', { page, per_page: 10});
        if (reponse.data.length > 0) {
            for (const repo of reponse.data){
                this.repos.push(repo);
            }
            await this.getRepos(page + 1);
        }
    }

    //required for Modules.load() using waffle manager
    async init() {
        this.log.info(name.toUpperCase(), `Starting ${name}...`);
        await this.getRepos(1);

        for (const repo of this.repos) {
            
            console.log(repo.name, repo.owner.login);
        }
        

        return true;
    }

    //required for Modules.cleanup() using waffle manager
    async cleanup() {}

}