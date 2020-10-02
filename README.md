# GitiLang
Welcome to Gitilang Find 🔟 languages that you mostly use ❤️


## Installation

- You must have installed ```NodeJS``` in your machine.

- You have a ```GitHub Account``` 

  ### **STEPS**
  1. Here's are steps to get GitHub Token.
    -  Visit https://github.com/settings/profile
    - Visit inside ```Developers Settings > Personal access tokens```.
    - Click on ```Generate new token```.
    - Inside Select scope select all ```repo scope```.
    - Now you copy your token.
    
  2. Open your terminal
    - Export your copied token as
      ```bash
      $> export GITHUB_TOKEN=YOUR_COPIED_TOKEN
      ```
    - Install ```gitilang``` package
      ```bash
      $> npm install -g gitilang
      ```
    - Verify gitilang is installed
      ```bash
      $> gitilang
      ```
  

## Usage
- Note: Gitilang only show ```public repo statistics```.
- Consider you want to see ```Google``` used top 10 languages.
- Open ```terminal```
```bash
# Verify gitilang is globally installed!
$> gitilang
VERSION
  gitilang/1.0.0 linux-x64 node-v10.14.2 # May vary version.

USAGE
  $ gitilang [COMMAND]

COMMANDS
  help  display help for gitilang
  show  Show you have used top 10 languages in Github Account :D

# Show all commands
$> gitilang help

# Particular command help
$> gitilang show -h
Show you have used top 10 languages in Github Account :D

USAGE
  $ gitilang show [USERNAME]

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  export GITHUB_TOKEN=YOUR_TOKEN
  $> gitilang show [UserName]
  $> gitilang show BhautikChudasama

# We want to see Google used top 10 languages
$> gitilang show google
# Remember Google is organization so select org
? Given Username is Organization or User? …
▸ org
  user
✅ Repositories Fetched!
✅ Repositories languages analyzed!
# Do you want to export fetched languages data, This case no
? Do you want to export fetched data? …
   yes
▸  no
# Now you see Google have used top 10 languages bytes.
✔ Do you want to export fetched data? · no
┌─────────┬──────────────┬──────────┐
│ (index) │      0       │    1     │
├─────────┼──────────────┼──────────┤
│    0    │ 'JavaScript' │ 14099827 │
│    1    │    'C++'     │ 13078046 │
│    2    │    'Java'    │ 7022866  │
│    3    │    'TeX'     │ 6184970  │
│    4    │    'HTML'    │ 1742227  │
│    5    │   'Python'   │  530826  │
│    6    │    'CSS'     │  487097  │
│    7    │     'C'      │  285801  │
│    8    │  'Starlark'  │  246761  │
│    9    │   'Kotlin'   │  121027  │
└─────────┴──────────────┴──────────┘

# Column 0 repesents language name
# Column 1 repesents language bytes
```

## Docker Usage
You can also use ```docker``` to used our CLI.

```bash
# Pull docker image
$> docker pull bhautikchudasama/gitilang

# Run
$> docker run -i -e GITHUB_TOKEN=YOUR_COPIED_TOKEN bhautikchudasama/gitilang google

# -i => Interactive to retain CLI
# -e => Pass your GITHUB_TOKEN to container
# google => We want to see google has used top 10 languages in their public Github repositories. 

```

## Contributors
- BhautikChudasama (@bhautiktweets).
