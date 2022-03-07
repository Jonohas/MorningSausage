import {
    ModuleBuilder
} from "waffle-manager";
import {
    Octokit
} from "@octokit/rest";
import fs from "fs";

import shell from 'shelljs';
import { exec } from 'child_process';

const name = "git_sync";

export const ModuleInfo = new ModuleBuilder(name);

export const ModuleInstance = class {
    constructor(main) {
        this.config = main.config;
        this.log = main.log;

        this.octokit = new Octokit({
            auth: this.config.github.github_pat
        });
        this.repos = [];
    }

    async getRepos(page) {
        const reponse = await this.octokit.request("GET /user/repos", {
            page,
            per_page: 10,
        });
        if (reponse.data.length > 0) {
            for (const repo of reponse.data) {
                if (repo.owner.login in this.config.github.ignore.orgs) {
                    if (
                        this.config.github.ignore.orgs[repo.owner.login].repos.length ===
                        0 ||
                        this.config.github.ignore.orgs[repo.owner.login].repos.includes(
                            repo.name
                        )
                    ) {
                        continue;
                    } else {
                        this.repos.push(repo);
                    }
                } else if (!this.config.github.ignore.repos.includes(repo.name)) {
                    this.repos.push(repo);
                }
            }
            await this.getRepos(page + 1);
        }
    }

    async cloneRepos() {
        for (const repo of this.repos) {
            let path = "";
            if (repo.owner.type === "User") {
                path = `./Github/${this.config.github.usrPrefix}${repo.owner.login}`;
            } else if (repo.owner.type === "Organization") {
                path = `./Github/${this.config.github.orgPrefix}${repo.owner.login}`;
            }
            fs.access(path, (error) => {
                // To check if the given directory
                // already exists or not
                if (error) {
                    // If current directory does not exist
                    // then create it
                    fs.mkdir(path, (error) => {
                    });
                }
            });
            let bufferObj = Buffer.from(this.config.github.github_pat, "utf8");
            let base64String = bufferObj.toString("base64");

            const repoPath = `${path}/${repo.name}`;
            fs.access(repoPath, (error) => {
                if (error) {
                    console.log(`Cloning: ${repo.full_name}`);
                    exec(`git -c http.extraheader="AUTHORIZATION:basic ${base64String}" clone ${repo.html_url} ${repoPath}`,  (err, stdout, stderr) => {
                        if (err) {
                          console.error(`exec error: ${err}`);
                          return;
                        }
                      
                        // console.log(`stdout: ${stdout}`);
                        // console.log(`stderr: ${stderr}`);
                    });

                } else {
                    console.log(`Pulling: ${repo.full_name}`);
                    exec(`git -c http.extraheader="AUTHORIZATION:basic ${base64String}" -C ${repoPath} pull`,  (err, stdout, stderr) => {
                        if (err) {
                          console.error(`exec error: ${err}`);
                          return;
                        }
                      
                        // console.log(`stdout: ${stdout}`);
                        // console.log(`stderr: ${stderr}`);
                    });
                }
            })
            
        }

        console.log('cloning/pulling is completed!');
    }

    //required for Modules.load() using waffle manager
    async init() {
        this.log.info(name.toUpperCase(), `Starting ${name}...`);
        await this.getRepos(1);

        await this.cloneRepos();

        return true;
    }

    //required for Modules.cleanup() using waffle manager
    async cleanup() {}
};