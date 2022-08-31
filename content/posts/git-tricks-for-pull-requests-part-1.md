---
title: "Git Tricks for Pull Requests Part 1"
date: 2022-08-31T17:33:49+02:00
tags: ["git", "cmdline", "linux"]
draft: true
---
to clone a branch[^git-pr-alias]
```bash
git push git@github.com:owner/repo.git HEAD:target-branch
```
In summary: You can push to an existing pull request if you push to the fork/branch that PR is based on. It is often possible depending on repo settings.

```bash
git push git@github.com:username/repo-name.git localbranchname:remotebranchname
```

or if you have the fork added as a remote in your local repo, then:

```bash
git push remotename localbranchname:remotebranchname
```

[^git-pr-alias]: {{< ref "/posts/useful-git-aliases-part-1" >}}
[^stack]: https://stackoverflow.com/questions/15530510/how-do-i-push-to-a-pull-request-on-github
