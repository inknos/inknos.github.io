---
title: "Packaging Journey Part 2"
date: 2022-01-27T12:00:51+02:00
draft: false
tldr: "When updating the package in Bugzilla during a review I suggest to bump the release number of the pkg. It will help the reviewer."
---

I recently reviewed a package: `python-pyftpdlib`.[^bugzilla]

It was a simple package review but of course there were some problems, here is how it went.

## The story in short

It is reviewer responsibility go through all the requirements for a package to be accepted in fedora. This package has a pretty simple specfile, it has no systemd scriptlets, it is a trivial package review, one might say.

The package is now ready to be reviewed again and then it's good to go. Fedora has a great helper for packages, the `fedora-review-service`. What it does is trying to build the package and running the review for you. Notice that during the first review, the service raised a warning[^comment-1].

After that, I had a single comment before approving the package review. "Non existing man page for binaries". This is a blocker. The packager promptly rebuilt the package and fixed the issue by generating man pages.

The package got automatically reviewed once again. Although the automation helps the reviewer quite a lot by saving a lot of time required to build and to run the `fedora-review` command, it has to be remembered that it is still an automatic tool and so one has to fully understand how it works to benefit from it.

On the second run of review, the automatic did not throw any warning or error... So where was my problem?

## The catch!

After downloading the package from the automatically generated copr repository I was not able to verify that the issue I pointed out was fixed, although `fedora-review` was not arguing with warnings anymore. Clearly the issue was on my side but it took some time to realize it.

What I did was simple:
```bash
dnf copr enable @fedora-review/fedora-review-2164342-python-pyftpdlib
```
and
```bash
dnf install python-pyftpdlib
```
but still no man pages...

Here's the catch! The copr repository[^copr] is built referencing the bug that is being reviewed. Every time a new build is requested the same repo will be used. So, the two builds[^copr-build-1][^copr-build-2] were the same package, with the same version and release in the same repositoty.

I got stuck downloading the "unpatched" package without realizing it for quite some time.

## How to mitigate it

Packagers, please increase the release number on every change you do to the specfile. This way you will always ensure to pull the up to date version from the automated copr repository!

Reviewers, please be sure to install the correct rpm from the correct build number. Here is how to do it in one command:
```bash
dnf install https://download.copr.fedorainfracloud.org/results/@fedora-review/fedora-review-2164342-python-pyftpdlib/fedora-37-x86_64/05307543-python-pyftpdlib/python3-pyftpdlib-1.5.7-1.fc37.noarch.rpm
```

Boom, no copr repo to enable, package up to date, everyone's happy!

[^bugzilla]: https://bugzilla.redhat.com/show_bug.cgi?id=2164342
[^copr]: https://copr.fedorainfracloud.org/coprs/g/fedora-review/fedora-review-2164342-python-pyftpdlib/
[^copr-build-2]: https://copr.fedorainfracloud.org/coprs/build/5290358
[^copr-build-2]: https://copr.fedorainfracloud.org/coprs/build/5307543
[^comment-1]: https://bugzilla.redhat.com/show_bug.cgi?id=2164342#c1
[^comment-5]: https://bugzilla.redhat.com/show_bug.cgi?id=2164342#c5
