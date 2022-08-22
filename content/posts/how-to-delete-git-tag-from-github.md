---
title: "How to Delete Git Tag From Github"
date: 2022-08-22T19:07:35+02:00
draft: true
---
open up a terminal window and navigate to your local GitHub repository.

```bash
git tag -d tagName
git push origin :tagName
```

If your tag has the same name as one of your branches, use this instead:

```bash
git tag -d tagName
git push origin :refs/tags/tagName
```

You need to replace tagName with the tag name that you want to delete.

