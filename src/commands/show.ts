import {Command, flags} from '@oclif/command'
import * as chalk from "chalk";
import { Octokit } from "@octokit/core";
const {Select} = require("enquirer");
const ora = require('ora');
const fs = require('fs');
const path = require('path');

export default class Show extends Command {
  static description = 'Show you have used top 10 languages in Github Account :D'

  static examples = [
    `export GITHUB_TOKEN=YOUR_TOKEN
$> gitilang show [UserName]
$> gitilang show BhautikChudasama`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
  }

  octokit:any = null;
  static args = [{name: 'username'}] // $> gitilang show USERNAME 

  showGraphURL = (data:any) => {
    let str = "https://gitilang.vercel.app/?";
    data.map((data:string, index:number) => {if(index==0) {str=str+`${data[0]}=${data[1]}`} else {str=str+`&${data[0]}=${data[1]}`}});
    console.log(`📊 Explore Chart at ${str}`);
  }

  exportData = async (data:any) => {
    let prompt = new Select({
      name: "type",
      message: "Do you want to export your file in TXT?",
      choices: ["yes", "no"]
    });
    const promptResult = await prompt.run();
    let filepath: any;
    switch(promptResult) {
      case "yes":
        filepath = path.join(__dirname, `${Date.now()}-GitiLangResult.txt`);
        fs.closeSync(fs.openSync(filepath, 'w'))
        fs.writeFile(filepath, data, (err:any) => {
          if(err) {
            throw new Error(err);
          }
          console.log(`✅ File Created at ${filepath}`);
          this.showGraphURL(data);
        });
        break;
      default:
        console.table(data);
        this.showGraphURL(data);
    }
  }

  showLangBytes = (username:any, repos:any) => {
    let progressStatRepos = ora('Fetching Repository Languages...').start();
    if(repos.data.length <= 0) {
      this.log(chalk.blue(":D Given username does not have any repository!!"));
      return;
    }
    const langsBytes:any = {};
    Promise.all(repos.data.map(async (repo: any) => {
      const langResponse = await this.octokit.request('GET /repos/{owner}/{repo}/languages', {
        owner: username,
        repo: repo.name
      })
      for(const [key, value] of Object.entries(langResponse.data)){
        let currentLang = langsBytes[key] || 0;
        langsBytes[key] = currentLang + Number(value);
      }
    })).then(async () => {
      progressStatRepos.stopAndPersist({prefixText: "✅", text: "Repositories languages analyzed!"});
      let sortedLangs = [];
      for(let lang in langsBytes) {
        sortedLangs.push([lang, langsBytes[lang]]);
      }
      sortedLangs = sortedLangs.sort((a, b) => b[1] - a[1]);
      if(sortedLangs.length >= 10) {
        sortedLangs = sortedLangs.slice(0, 11);
      }
      let prompt = new Select({
        name: "export",
        message: "Do you want to export fetched data?",
        choices: ["yes", "no"]
      });
      const promptResult = await prompt.run();
      switch(promptResult) {
        case "yes":
          this.exportData(sortedLangs);
          break;
        case "no":
        default:
          console.table(sortedLangs);
          this.showGraphURL(sortedLangs);
      }
      return;
    }).catch(err => {
      this.log(chalk.red('(!) ') + chalk.blue("Error ocurred!!"));
      this.log(chalk.red('ERROR: ') + chalk.blue(err));
      this.log(chalk.red('ERROR REASONS: '));
      this.log(chalk.blue("1. May be you have choosed wrong prompt!!"));
      this.log(chalk.blue("2. Token is invalid!!"));
      this.log(chalk.blue("3. You are offline!!"));
    });
  }

  run = async() => {
    if(process.env.GITHUB_TOKEN === undefined || process.env.GITHUB_TOKEN.length <= 0) {
      this.log(chalk.red("Please set GITHUB_TOKEN environment variable!"));
      return;
    }
    this.octokit= new Octokit({auth: process.env.GITHUB_TOKEN});
    const {args, flags} = this.parse(Show);
    if(args.username) {
      try {
        let prompt = new Select({
          name: "UserType",
          message: "Given Username is Organization or User?",
          choices: ["org", "user"]
        });
        const promptResult = await prompt.run();
        let progressFetchingRepos = ora("Fetching Repositories...").start();
        switch(promptResult) {
          case "org":
            const orgResponse = await this.octokit.request('GET /orgs/{org}/repos', {
              org: args.username,
              type: "public"
            });
            progressFetchingRepos.stopAndPersist({prefixText: "✅", text: "Repositories Fetched!"});
            this.showLangBytes(args.username, orgResponse);
            return;
          case "user":
            const userResponse:any = await this.octokit.request('GET /users/{user}/repos', {
              user: args.username,
              type: "public"
            });
            progressFetchingRepos.stopAndPersist({prefixText: "✅", text: "Repositories Fetched!"});
            this.showLangBytes(args.username, userResponse);
            return;
            break;
          default:
            this.log(chalk.red('(!) ') + chalk.blue("Error ocurred!!"));
        }
      } 
      catch(e) {
        this.log(chalk.red('(!) ') + chalk.blue("Error ocurred!!"));
        this.log(chalk.red('ERROR: ') + chalk.blue(e));
        this.log(chalk.red('ERROR REASONS: '));
        this.log(chalk.blue("1. May be you have choosed wrong prompt!!"));
        this.log(chalk.blue("2. Token is invalid!!"));
        this.log(chalk.blue("3. You are offline!!"));
        return;
      }
    }
    else {
      this.log(chalk.red('(!) ') + chalk.blue("Please enter GitHub Username"))
      this.log(chalk.red('Example: ') + chalk.blue("$> gitilang show BhautikChudasama"))
    }
  }
}
