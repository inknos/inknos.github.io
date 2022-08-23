---
title: "How to Cut Git History the Clean Way"
date: 2022-08-08T16:26:29+02:00
tags: ["git", "linux", "github", "dnf", "tips"]
draft: false
---

## My use case
Happened to my team and I to work on a repository that, as many others have, has a `main` and `devel` branch.
The repo is [dnf](https://github.com/rpm-software-manaement/dnf) and, while developing dnf5, the `devel` branch became
so different from the initial codebase that it became a new component. Here, the problem to separate the codebase from
[dnf](https://github.com/rpm-software-management/dnf) to [dnf5](https://github.com/rpm-software-management/dnf5).
In this specific scenario, it was convenient for my team to cut the git history, to get a lighter repo and to cut some
binaries that were in the history of the old `dnf`.

## Find where to cut

Firs of all, you should find out where to cut i.e. the commit hash. I will use my hash in this example.
[^cut][^how-to-truncate]
```
CUT_HERE=6d812e72f7c1cf979de1ad404ac5a9a460ade4de
```
This is the procedure to truncate with git, so let's do it.

```bash
git checkout --orphan temp $CUT_HERE
git commit -m "Truncated history"
git rebase --onto temp $CUT_HERE master
git branch -D temp
```

## Use a temp branch

Let's checkout the right branch, you don't want to cut the wrong one right?

```bash
git checkout dnf-5-devel
git checkout -b dnf5-test-branch
```

I just created a branch named `dnf5-test-branch` which is where I will rebase my truncated history.
Now, we know already the commit we want to cut at, so let's create a new orphan branch named `temp`:

```bash
git checkout dnf-5-devel
git checkout --orphan temp $CUT_HERE
```

Let's commit all files to it

```bash
git commit -m "Truncated History"
```

And now we need to rebase all commits from our start on `dnf5-test-branch`

```bash
git rebase --onto temp $CUT_HERE dnf5-test-branch
```

Now the history should be good to go and it should start at our commit `"Truncated History"`. Let's check it.
```bash
* eba1b096 [dnf5] Add empty Base class
* 82d11c6f Import a new project template
* 7ecef58c (temp) Truncated history
(END)
```

Cool! We can now delete `temp`
```bash
git branch -D temp
```


## Delete binaries and unwanted files from history [^remove-sensitive-data]

At this point there are many ways to proceed but I find the tool `git-filter-repo`[^git-filter-repo][^docs-filter-repo]
the most useful and safe.

Here, for example, I have an entire dir to delete from history. Inside this folder there is the whole codebase of
`dnf-4`, moved here for convenience, but we don't need it anymore, right?
```bash
git filter-repo --path dnf-4 --invert-paths --force --refs dnf5-test-branch
```

Now I know that there are some files in a commit that I need to remove. It's a bunch of `.rpm` files.
I can find the commmit hash quite easily by looking for rpms in the log and once I find the hash (which
changes every time) I can export a file list.
```bash
git diff-tree --no-commit-id --name-only -r 0f1e4e3d24268d367b59cafa48337eec46e09192 >> deleted-rpms.txt
```
Then I can edit the file and select just the files I want to delete from the history.
Once my file is ready I procede to delete everything I don't ever need.
```bash
git filter-repo --paths-from-file deleted-rpms.txt --invert-paths --refs dnf5-test-branch
```
## Check the new history

Checking the new history can be touch right? Here's a way to do it.
```bash
git log --stat $CUT_HERE..dnf-5-devel > OLD
git log --stat --root > NEW
vimdiff OLD NEW
```
And we should only see differences in the commit hash.

Now it's time to push our new codebase to the new repo so that's easy.
Just remove all branches except `dnf5-test-branch`, rename it to `main`, remove all remotes, add correct remotes,
push...1, 2, 3... Done!

[^cut]: https://github.com/rpm-software-management/libdnf/commit/6d812e72f7c1cf979de1ad404ac5a9a460ade4de
[^how-to-truncate]: https://web.archive.org/web/20130116195128/http://bogdan.org.ua/2011/03/28/how-to-truncate-git-history-sample-script-included.html

[^remove-sensitive-data]: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository
[^git-filter-repo]: https://github.com/newren/git-filter-repo
[^docs-filter-repo]: https://htmlpreview.github.io/?https://github.com/newren/git-filter-repo/blob/docs/html/git-filter-repo.html
