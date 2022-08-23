---
title: "How to Move Commits to a New Branch"
date: 2022-01-26T16:21:58+02:00
tags: ["linux", "git", "cmdline", "tips"]
draft: false
---
# Move Git commits from some-branch to some-other-branch

This is not my post, I put it here for convenience, you can find the original here[^1]

I.e. How can I go from this
```
master A - B - C - D - E
```
to this?
```
newbranch     C - D - E
             /
master A - B 
```
## 1. existing branch

If your branch where you want to move your commits already exists, these steps will probably do the trick.

```bash
git checkout existingbranch
git merge master
git checkout master
git reset --hard HEAD~3 # Go back 3 commits. You *will* lose uncommitted work.
git checkout existingbranch
```

**Note:
You can store uncommitted edits to your stash before doing this, using `git stash`. Once complete, you can retrieve the stashed uncommitted edits with `git stash pop`.**

## 2. new branch

**WARNING**: This method works because you are creating a new branch with the first command: `git branch newbranch`. If you want to move commits to an **existing branch** you need to merge your changes into the existing branch before executing `git reset --hard HEAD~3` (see Moving to an *existing branch above*). **If you don't merge your changes first, they will be lost**.

Unless there are other circumstances involved, this can be easily done by branching and rolling back.

**Note: Any changes not committed will be lost.**

```bash
git branch newbranch      # Create a new branch, saving the desired commits
git reset --hard HEAD~3   # Move master back by 3 commits (Make sure you know how many commits you need to go back)
git checkout newbranch    # Go to the new branch that still has the desired commits
```

But do make sure how many commits to go back. Alternatively, you can instead of HEAD~3, simply provide the hash of the commit (or the reference like origin/master) you want to "revert back to" on the master (/current) branch, e.g:

```bash
git reset --hard a1b2c3d4
```

*1 You will **only** be "losing" commits from the master branch, but don't worry, you'll have those commits in newbranch!

## References

[^1]: https://stackoverflow.com/questions/1628563/move-the-most-recent-commits-to-a-new-branch-with-git
