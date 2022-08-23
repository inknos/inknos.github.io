---
title: "Packaging Journey Part 1"
date: 2022-08-23T16:55:51+02:00
tags: ["fedora", "packaging", "rpm", "linux"]
tldr: "Before releasing a new package, make sure that your specfile matches the one inside your SRPM."
draft: false
---

# Packaging Journey pt.1: Packaging is easy

Well, you just need to do things right. So this is a list of few problems I went through as a Fedora
Contributor[^existing-contributor]

When you are in uni the best way to learn something is not to study it but to take the exam. Either if you pass or fail
you will learn more than in a month of study. The same applies for many things such as releasing software. In this case,
practice is the examination, and the review process is what makes you learn new (obvious) things.


## Understand what a SRPM is (it was easy)

What is a SRPM? Essentially, the Source RPM is what you need i.e. the source code to build an RPM.
So, a SRPM contains the source code (or references to it) the instructions on how to build it and install it
(in the .spec file) and eventually some patches.[^packaging-redhat]

Ok so what was my first snag?

In order to create a new package you need to provide:
  1. .spec file
  2. Source RPM

Easy, and since your .spec file is inside your SRPM they should be the same, right?
Well... That didn't quite work for me because I got a complaint straight away that the spec files were not the same.
But the .spec file and SRPM .spec file were the same. How could it be?

## Build it right (or check it)

What was inside my SRPM then?
I would call now:
  1. upstream.spec: the .spec file from upstream
  2. srpm.spec: the .spec file from the SRPM

First, I downloaded my SRPM. It comes from a nightly repo, so should totally have the upstream.spec inside.
Then, I download my upstream.spec.
Then I extract the srpm.spec, If you don't know how to do it I will show two ways here.

```bash
rpm2cpio dnf5-5.0.0-0~pre.fc38.src.rpm | cpio -cv '*.spec'
```
or
```bash
rpm2archive dnf5-5.0.0-0~pre.fc35.src.rpm
```
And then extract the archive.

Once we have it 
```bash
$ diff upstream.spec srpm.spec
6,7c6,7
< Version:        %{project_version_major}.%{project_version_minor}.%{project_version_patch}
< Release:        0~pre%{?dist}
---
> Version: 5.0.0
> Release: 20220823012052.5.0.0.pre+0.g3859e45d%{?dist}
11c11
< Source0:        %{url}/archive/%{version}/dnf5-%{version}.tar.gz
---
> Source0: dnf5-5.0.0-20220823012052.5.0.0.pre+0.g3859e45d.tar.xz
...
```
Uh oh, they are different! Ohh, that WAS easy!

Some variables got expanded during nightly builds. What a stupid mistake.

## What you learn from it

If you have to release a new package on fedora, make a new copr repository just for that and before provinding the .spec
file and the SRPM be sure to check that the files are the same.


[^existing-contributor]: https://docs.fedoraproject.org/en-US/package-maintainers/New_Package_Process_for_Existing_Contributors/
[^packaging-redhat]: https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/packaging_and_distributing_software/packaging-software_packaging-and-distributing-software
