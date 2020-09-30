gitilang
========


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g gitilang
$ gitilang COMMAND
running command...
$ gitilang (-v|--version|version)
gitilang/1.0.0 linux-x64 node-v10.19.0
$ gitilang --help [COMMAND]
USAGE
  $ gitilang COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`gitilang help [COMMAND]`](#gitilang-help-command)
* [`gitilang show [USERNAME]`](#gitilang-show-username)

## `gitilang help [COMMAND]`

display help for gitilang

```
USAGE
  $ gitilang help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_

## `gitilang show [USERNAME]`

Show you have used top 10 languages in Github Account :D

```
USAGE
  $ gitilang show [USERNAME]

OPTIONS
  -e, --env=env  ENV file to read private repositories.
  -h, --help     show CLI help

EXAMPLE
  $> gitilang show [UserName]
  $> gitilang show BhautikChudasama
```

_See code: [src/commands/show.ts](https://github.com/BhautikChudasama/gitlang/blob/v1.0.0/src/commands/show.ts)_
<!-- commandsstop -->
