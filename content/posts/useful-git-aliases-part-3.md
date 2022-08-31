---
title: "Useful Git Aliases Part 3"
date: 2022-08-31T17:33:29+02:00
draft: true
---

```bash
ctags = !git ls-files | ctags \
        --tag-relative -L - -f"$(git rev-parse --show-toplevel)/tags" \
        --python-kinds=-i \
        --c++-kinds=+p --fields=+iaS --extras=+q
```
