---
title: "Packaging Tips: Rpm Macros"
date: 2022-08-24T14:10:54+02:00
tags: ["rpm", "linux", "packaging", "fedora", "rhel"]
draft: true
---

One thing I wanted to know about rpm macros.
```bash
$ rpm --eval %{_bindir}
/usr/bin
```

What if I want to read the full specfile expanded?[^expand-all-macros]

```bash
$ rpmspec -P name.spec
```

What if I want to read a specific macro (like `%{name}`)?
```bash
rpm -q --specfile d-spy.spec --qf "%{name}\n"
```

And what if I want to read a line expanded[^packaging-guidelines-macro] like `Source:`?
```bash
rpm -q --specfile foo.spec --qf "$(grep -i ^Source foo.spec)\n"
```

Will do the trick

[^expand-all-macros]: https://stackoverflow.com/questions/3634650/can-i-use-rpm-to-expand-the-macros-in-a-specfile#7901349
[^packaging-guidelines-macro]: https://docs.fedoraproject.org/en-US/packaging-guidelines/#_macros

