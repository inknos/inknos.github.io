---
title: "Useful Git Aliases Part 1"
date: 2022-08-31T17:33:23+02:00
draft: true
---

pr = !sh -c 'git fetch $1 pull/$2/head:pr-$1-$2 && git checkout pr-$1-$2' -
