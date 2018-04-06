# Manpages of the command-line tool

## Table of Contents

* [`konitor` or `konitor interactive`](#interactive)
* [`konitor pulls`](#pulls)
* [`konitor test trainline`](#test)
* [`konitor testit ../trainline`](#testit)

---

## Interactive

> To launch konitor with interactive mode, so it ask you what do you want to do.

### Help

```
$ konitor interactive --help

 _                      _   _
| | __   ___    _ __   (_) | |_    ___    _ __
| |/ /  / _ \  | '_ \  | | | __|  / _ \  | '__|
|   <  | (_) | | | | | | | | |_  | (_) | | |
|_|\_\  \___/  |_| |_| |_|  \__|  \___/  |_|

vX.X.X

konitor interactive

Launch interactive mode

Options:
--help     Show help                                                 [boolean]
--version  Show version number                                       [boolean]
```

### Example

```
 _                      _   _
| | __   ___    _ __   (_) | |_    ___    _ __
| |/ /  / _ \  | '_ \  | | | __|  / _ \  | '__|
|   <  | (_) | | | | | | | | |_  | (_) | | |
|_|\_\  \___/  |_| |_| |_|  \__|  \___/  |_|

vX.X.X

? What do you want to do? (Use arrow keys)
❯ Test a konnector
Pull all konnectors
Quit
```

---

## Pulls

> Pulls all konnectors on preference directory

### Help

```
$ konitor pulls --help

 _                      _   _
| | __   ___    _ __   (_) | |_    ___    _ __
| |/ /  / _ \  | '_ \  | | | __|  / _ \  | '__|
|   <  | (_) | | | | | | | | |_  | (_) | | |
|_|\_\  \___/  |_| |_| |_|  \__|  \___/  |_|

vX.X.X

konitor pulls

Pull all konnectors

Options:
--help     Show help                                                 [boolean]
--version  Show version number                                       [boolean]
```

### Example

```
$ konitor pulls

  _                      _   _
 | | __   ___    _ __   (_) | |_    ___    _ __
 | |/ /  / _ \  | '_ \  | | | __|  / _ \  | '__|
 |   <  | (_) | | | | | | | | |_  | (_) | | |
 |_|\_\  \___/  |_| |_| |_|  \__|  \___/  |_|

 vX.X.X

Pull all konnectors:

 - ✅  cozy-konnector-ameli: {"changes":0,"insertions":0,"deletions":0}
 - ✅  cozy-konnector-bouyguesbox: {"changes":0,"insertions":0,"deletions":0}
 - ✅  cozy-konnector-bouyguestelecom: {"changes":0,"insertions":0,"deletions":0}
 - ✅  cozy-konnector-digiposte: {"changes":0,"insertions":0,"deletions":0}
 - ✅  cozy-konnector-free: {"changes":0,"insertions":0,"deletions":0}
 - ✅  cozy-konnector-free-mobile: {"changes":2,"insertions":53,"deletions":5}
 - ✅  cozy-konnector-harmonie: {"changes":0,"insertions":0,"deletions":0}
 - ✅  cozy-konnector-maif: {"changes":0,"insertions":0,"deletions":0}
 - ✅  cozy-konnector-malakoffmederic: {"changes":0,"insertions":0,"deletions":0}
 - ✅  cozy-konnector-materielnet: {"changes":0,"insertions":0,"deletions":0}
 - ✅  cozy-konnector-mgen: {"changes":1,"insertions":13,"deletions":9}
 - ✅  cozy-konnector-numericable: {"changes":0,"insertions":0,"deletions":0}
 - ✅  cozy-konnector-orange: {"changes":0,"insertions":0,"deletions":0}
 - ✅  cozy-konnector-orangevod: {"changes":0,"insertions":0,"deletions":0}
 - ✅  cozy-konnector-sosh: {"changes":0,"insertions":0,"deletions":0}
 - ✅  cozy-konnector-sfrbox: {"changes":0,"insertions":0,"deletions":0}
 - ✅  cozy-konnector-sfrmobile: {"changes":0,"insertions":0,"deletions":0}
 - ✅  cozy-konnector-redbox: {"changes":0,"insertions":0,"deletions":0}
 - ✅  cozy-konnector-redmobile: {"changes":0,"insertions":0,"deletions":0}
 - ✅  cozy-konnector-trainline: {"changes":4,"insertions":59,"deletions":6}
 - ✅  cozy-konnector-uber: {"changes":0,"insertions":0,"deletions":0}
 - ✅  cozy-konnector-sncf: {"changes":0,"insertions":0,"deletions":0}
 - ✅  cozy-konnector-virgin-mobile: {"changes":0,"insertions":0,"deletions":0}
```

---

## Test

> You can test a konnector with slug or repository name:
>
> * `konitor test trainline`
> * `konitor test cozy-konnector-trainline`

### Help

```
$ konitor test --help

_                      _   _
| | __   ___    _ __   (_) | |_    ___    _ __
| |/ /  / _ \  | '_ \  | | | __|  / _ \  | '__|
|   <  | (_) | | | | | | | | |_  | (_) | | |
|_|\_\  \___/  |_| |_| |_|  \__|  \___/  |_|

vX.X.X

konitor test <name> [options]

Test a konnector

Options:
--help             Show help                                         [boolean]
--version          Show version number                               [boolean]
--config, -c       Path to a config file                      [default: false]
--interactive, -i  Launch interactive mode                     [default: true]
```

### Example

```
$ konitor test trainline

 _                      _   _
| | __   ___    _ __   (_) | |_    ___    _ __
| |/ /  / _ \  | '_ \  | | | __|  / _ \  | '__|
|   <  | (_) | | | | | | | | |_  | (_) | | |
|_|\_\  \___/  |_| |_| |_|  \__|  \___/  |_|

vX.X.X

Test konnector trainline:

- ✅  repository is up to date.
- ✅  dependencies is installed.
- ✅  repository is clean.
- ✅  Correctly executed.
- ✅  Correctly logged in.
- ✅  PDF is imported.
- ✅  repository is clean.
```

---

## testit

> You can test a konnector with path

### Help

```
$ konitor testit --help

  _                      _   _
 | | __   ___    _ __   (_) | |_    ___    _ __
 | |/ /  / _ \  | '_ \  | | | __|  / _ \  | '__|
 |   <  | (_) | | | | | | | | |_  | (_) | | |
 |_|\_\  \___/  |_| |_| |_|  \__|  \___/  |_|

 vX.X.X

konitor testit <path> [options]

Test from a konnector

Options:
  --help             Show help                                         [boolean]
  --version          Show version number                               [boolean]
  --config, -c       Path to a config file                      [default: false]
  --interactive, -i  Launch interactive mode                     [default: true]
```

### Example

```
$ konitor testit ../trainline

 _                      _   _
| | __   ___    _ __   (_) | |_    ___    _ __
| |/ /  / _ \  | '_ \  | | | __|  / _ \  | '__|
|   <  | (_) | | | | | | | | |_  | (_) | | |
|_|\_\  \___/  |_| |_| |_|  \__|  \___/  |_|

vX.X.X

Test konnector trainline:

- ✅  dependencies is installed.
- ✅  repository is clean.
- ✅  Correctly executed.
- ✅  Correctly logged in.
- ✅  PDF is imported.
- ✅  repository is clean.
```

## check 🤓

Check is used to programmatically check our guidelines against a repository. Use it before publishing your konnector for it to be production ready 🚀

Here is a sample output :

```bash
$ konitor check ./cozy-konnector-ameli/
Checking ./cozy-konnector-ameli/
Eslint with prettier is used to lint the code (check for eslintConfig in package.json) ❌
 -  eslintConfig should extend from prettier ❌
Fields (necessary for login) are defined in manifest.konnector ❌
 -  The fields should not be in old format ❌
Travis is correctly configured to deploy master/prod. ✅
Renovate should be correctly configured. ❌
 -  Renovate config should extend from the cozy-konnector config ❌
Check the documentation:  https://github.com/konnectors/docs/blob/master/status.md#renovate
Repository should have 4 branches. ✅
```
