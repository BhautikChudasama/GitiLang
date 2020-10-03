// Copyright 2020 Bhautik Chudasama
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


import { Command, flags } from "@oclif/command";
import * as chalk from "chalk";
import { Octokit } from "@octokit/core";
const { Select } = require("enquirer");
const ora = require("ora");
const fs = require("fs");
const path = require("path");

class BetterType {
  LANGUAGES: any = null;
  BYTES: any = null;
  constructor(languages: any, bytes: any) {
    this.LANGUAGES = languages;
    this.BYTES = bytes;
  }
}

export default class Show extends Command {
  static description =
    "Show you have used top 10 languages in Github Account :D";

  static examples = [
    `export GITHUB_TOKEN=YOUR_TOKEN
$> gitilang show [UserName]
$> gitilang show BhautikChudasama`,
  ];

  static flags = {
    help: flags.help({ char: "h" }),
  };

  progressFetchingRepos: any = null;
  octokit: any = null;
  static args = [{ name: "username" }]; // $> gitilang show USERNAME

  // Interactive chart URL
  showGraphURL = (data: any) => {
    let str = "https://csb-bmzgc-3wlwvxbd1.vercel.app/?";
    data.map((data: string, index: number) => {
      if (index == 0) {
        str = str + `${data[0]}=${data[1]}`;
      } else {
        str = str + `&${data[0]}=${data[1]}`;
      }
    });
    console.log(`📊 Explore Chart at ${str}`);
  };

  // Exporting data to .TXT
  exportData = async (data: any) => {
    let prompt = new Select({
      name: "type",
      message: "Do you want to export your file in TXT?",
      choices: ["yes", "no"],
    });
    const promptResult = await prompt.run();
    let filepath: any;
    switch (promptResult) {
      case "yes":
        filepath = path.join(__dirname, `${Date.now()}-GitiLangResult.txt`);
        fs.closeSync(fs.openSync(filepath, "w"));
        fs.writeFile(filepath, data, (err: any) => {
          if (err) {
            throw new Error(err);
          }
          console.log(`✅ File Created at ${filepath}`);
          this.showGraphURL(data);
        });
        break;
      default:
        let finalObjects: any[] = [];
        data.map((row: any) => {
          finalObjects.push(new BetterType(row[0], row[1]));
        });
        console.table(finalObjects);
        this.showGraphURL(data);
    }
  };

  /**
   * Find the languages of repos
   * @param username Username
   * @param repos Repo
   */
  showLangBytes = async (username: any, repos: any) => {
    let progressStatRepos = ora("Fetching Repository Languages...").start();
    if (repos.data.length <= 0) {
      this.log(chalk.blue(":D Given username does not have any repository!!"));
      return;
    }
    const langsBytes: any = {};
    // Sequence of fetching
    for (let repo of repos.data) {
      const langResponse = await this.octokit.request(
        "GET /repos/{owner}/{repo}/languages",
        {
          owner: username,
          repo: repo.name,
        }
      );

      for (const [key, value] of Object.entries(langResponse.data)) {
        let currentLang = langsBytes[key] || 0;
        langsBytes[key] = currentLang + Number(value);
      }
    }
    progressStatRepos.stopAndPersist({
      prefixText: "✅",
      text: "Repositories languages analyzed!",
    });
    let sortedLangs = [];
    for (let lang in langsBytes) {
      sortedLangs.push([lang, langsBytes[lang]]);
    }
    sortedLangs = sortedLangs.sort((a, b) => b[1] - a[1]);
    if (sortedLangs.length >= 10) {
      sortedLangs = sortedLangs.slice(0, 10);
    }
    let prompt = new Select({
      name: "export",
      message: "Do you want to export fetched data?",
      choices: ["yes", "no"],
    });

    // Export prompt
    const promptResult = await prompt.run();
    switch (promptResult) {
      case "yes":
        this.exportData(sortedLangs); // Export data
        break;
      case "no":
      default:
        let finalObjects: any[] = [];
        sortedLangs.map((row: any) => {
          finalObjects.push(new BetterType(row[0], row[1]));
        });
        console.table(finalObjects); // Print data
        this.showGraphURL(sortedLangs); // Show graph URL
    }
    return;
  };

  // Inital function run when $> gitilang show [USERNAME]
  run = async () => {
    // If user hasn't exported GITHUB_TOKEN
    if (
      process.env.GITHUB_TOKEN === undefined ||
      process.env.GITHUB_TOKEN.length <= 0
    ) {
      this.log(chalk.red("Please set GITHUB_TOKEN environment variable!"));
      return;
    }
    this.octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    const { args, flags } = this.parse(Show); // Get ```show``` arguments and flags
    if (args.username) {
      try {
        // Github have organization and users accounts
        // Ask about which type account's entered in arguments ```git show [USERNAME]```
        let prompt = new Select({
          name: "UserType",
          message: "Given Username is Organization or User?",
          choices: ["org", "user"],
        });
        const promptResult = await prompt.run();
        this.progressFetchingRepos = ora("Fetching Repositories...").start(); // Show loading...
        switch (promptResult) {
          case "org":
            // fetching org repos
            const orgResponse = await this.octokit.request(
              "GET /orgs/{org}/repos",
              {
                org: args.username,
                type: "public",
              }
            );
            this.progressFetchingRepos.stopAndPersist({
              prefixText: "✅",
              text: "Repositories Fetched!",
            });
            this.showLangBytes(args.username, orgResponse);
            return;
          case "user":
            // fetching user repos
            const userResponse: any = await this.octokit.request(
              "GET /users/{user}/repos",
              {
                user: args.username,
                type: "public",
              }
            );
            this.progressFetchingRepos.stopAndPersist({
              prefixText: "✅",
              text: "Repositories Fetched!",
            });
            this.showLangBytes(args.username, userResponse);
            return;
            break;
          default:
            this.log(chalk.red("(!) ") + chalk.blue("Error ocurred!!"));
        }
      } catch (e) {
        this.log(chalk.red("(!) ") + chalk.blue("Error ocurred!!"));
        this.log(chalk.red("ERROR: ") + chalk.blue(e));
        this.log(chalk.red("ERROR REASONS: "));
        this.log(chalk.blue("1. May be you have choosed wrong prompt!!"));
        this.log(chalk.blue("2. Token is invalid!!"));
        this.log(chalk.blue("3. You are offline!!"));
        this.progressFetchingRepos.stopAndPersist({
          prefixText: "❌",
          text: "Error Occurred!!",
        });
        return;
      }
    } else {
      this.log(chalk.red("(!) ") + chalk.blue("Please enter GitHub Username"));
      this.log(
        chalk.red("Example: ") + chalk.blue("$> gitilang show BhautikChudasama")
      );
    }
  };
}
