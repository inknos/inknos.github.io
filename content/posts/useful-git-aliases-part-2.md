---
title: "Useful Git Aliases Part 2"
date: 2022-08-31T17:33:27+02:00
draft: true
---

mr = !sh -c 'git fetch $1 merge-requests/$2/head:mr-$1-$2 && git checkout mr-$1-$2' -

