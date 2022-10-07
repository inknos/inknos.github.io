---
title: "My Overcomplicated Server Setup Part 1"
date: 2022-10-07T18:56:55+02:00
draft: true
---

https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/9/html/deduplicating_and_compressing_logical_volumes_on_rhel/creating-a-deduplicated-and-compressed-logical-volume_deduplicating-and-compressing-logical-volumes-on-rhel#creating-an-lvm-vdo-volume_creating-a-deduplicated-and-compressed-logical-volume

https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/9/html/configuring_and_managing_logical_volumes/managing-lvm-physical-volumes_configuring-and-managing-logical-volumes#creating-lvm-physical-volume_managing-lvm-physical-volumes

[root@morla ~]# pvcreate /dev/sda
  Physical volume "/dev/sda" successfully created.
[root@morla ~]# pvdisplay
  --- Physical volume ---
  PV Name               /dev/nvme0n1p3
  VG Name               rhel
  PV Size               464.17 GiB / not usable 3.00 MiB
  Allocatable           yes (but full)
  PE Size               4.00 MiB
  Total PE              118828
  Free PE               0
  Allocated PE          118828
  PV UUID               JGCGkB-33MM-uoYr-Baro-wGWr-TQEq-VJ9Yd2

  "/dev/sda" is a new physical volume of "16.37 TiB"
  --- NEW Physical volume ---
  PV Name               /dev/sda
  VG Name
  PV Size               16.37 TiB
  Allocatable           NO
  PE Size               0
  Total PE              0
  Free PE               0
  Allocated PE          0
  PV UUID               OhoNi2-XkjY-Db8B-vo1C-tqU2-HiKa-AcGNGS

[root@morla ~]# pvs
  PV             VG   Fmt  Attr PSize   PFree
  /dev/nvme0n1p3 rhel lvm2 a--  464.17g     0
  /dev/sda            lvm2 ---   16.37t 16.37t
[root@morla ~]# pvscan
  PV /dev/nvme0n1p3   VG rhel            lvm2 [464.17 GiB / 0    free]
  PV /dev/sda                            lvm2 [16.37 TiB]
  Total: 2 [16.82 TiB] / in use: 1 [464.17 GiB] / in no VG: 1 [16.37 TiB]


----



https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/9/html/configuring_and_managing_logical_volumes/managing-lvm-volume-groups_configuring-and-managing-logical-volumes#creating-lvm-volume-group_managing-lvm-volume-groups
[root@morla ~]# vgcreate one /dev/sda
  Volume group "one" successfully created
[root@morla ~]# vgs
  VG   #PV #LV #SN Attr   VSize   VFree
  one    1   0   0 wz--n-  16.37t 16.37t
  rhel   1   3   0 wz--n- 464.17g     0

[root@morla ~]# vgdisplay
  --- Volume group ---
  VG Name               rhel
  System ID
  Format                lvm2
  Metadata Areas        1
  Metadata Sequence No  4
  VG Access             read/write
  VG Status             resizable
  MAX LV                0
  Cur LV                3
  Open LV               3
  Max PV                0
  Cur PV                1
  Act PV                1
  VG Size               464.17 GiB
  PE Size               4.00 MiB
  Total PE              118828
  Alloc PE / Size       118828 / 464.17 GiB
  Free  PE / Size       0 / 0
  VG UUID               PtfUuB-fTm8-zml8-NfqI-crpb-sEh2-h93XvK

  --- Volume group ---
  VG Name               one
  System ID
  Format                lvm2
  Metadata Areas        1
  Metadata Sequence No  1
  VG Access             read/write
  VG Status             resizable
  MAX LV                0
  Cur LV                0
  Open LV               0
  Max PV                0
  Cur PV                1
  Act PV                1
  VG Size               16.37 TiB
  PE Size               4.00 MiB
  Total PE              4291583
  Alloc PE / Size       0 / 0
  Free  PE / Size       4291583 / 16.37 TiB
  VG UUID               fzOrQT-UtAZ-09rP-E0ly-gdV6-4G2d-436u5E



[root@morla ~]# vgscan
  Found volume group "rhel" using metadata type lvm2
  Found volume group "one" using metadata type lvm2

[root@morla ~]# lvcreate --type vdo --name media --size 6T --virtualsize 18T one
    The VDO volume can address 5 TB in 3070 data slabs, each 2 GB.
    It can grow to address at most 16 TB of physical storage in 8192 slabs.
    If a larger maximum size might be needed, use bigger slabs.
  Logical volume "media" created.
[root@morla ~]# lvcreate --type vdo --name vault --size 10T --virtualsize 30T one
    The VDO volume can address 9 TB in 5118 data slabs, each 2 GB.
    It can grow to address at most 16 TB of physical storage in 8192 slabs.
    If a larger maximum size might be needed, use bigger slabs.
  Logical volume "vault" created.

[root@morla ~]# lvs
  LV     VG   Attr       LSize    Pool   Origin Data%  Meta%  Move Log Cpy%Sync Convert
  media  one  vwi-a-v---   18.00t vpool0        0.00
  vault  one  vwi-a-v---   30.00t vpool1        0.00
  vpool0 one  dwi-------    6.00t               0.13
  vpool1 one  dwi-------   10.00t               0.11
  home   rhel -wi-ao---- <378.45g
  root   rhel -wi-ao----   70.00g
  swap   rhel -wi-ao----   15.72g

[root@morla ~]# lvscan
  ACTIVE            '/dev/rhel/swap' [15.72 GiB] inherit
  ACTIVE            '/dev/rhel/home' [<378.45 GiB] inherit
  ACTIVE            '/dev/rhel/root' [70.00 GiB] inherit
  inactive          '/dev/one/vpool0' [6.00 TiB] inherit
  ACTIVE            '/dev/one/media' [18.00 TiB] inherit
  inactive          '/dev/one/vpool1' [10.00 TiB] inherit
  ACTIVE            '/dev/one/vault' [30.00 TiB] inherit
[root@morla ~]#

[root@morla ~]# mkfs.xfs -K /dev/one/vault
meta-data=/dev/one/vault         isize=512    agcount=30, agsize=268435455 blks
         =                       sectsz=4096  attr=2, projid32bit=1
         =                       crc=1        finobt=1, sparse=1, rmapbt=0
         =                       reflink=1    bigtime=1 inobtcount=1
data     =                       bsize=4096   blocks=8053063650, imaxpct=5
         =                       sunit=0      swidth=0 blks
naming   =version 2              bsize=4096   ascii-ci=0, ftype=1
log      =internal log           bsize=4096   blocks=521728, version=2
         =                       sectsz=4096  sunit=1 blks, lazy-count=1
realtime =none                   extsz=4096   blocks=0, rtextents=0
[root@morla ~]# mkfs.ext4 -E nodiscard /dev/one/media
mke2fs 1.46.5 (30-Dec-2021)
Creating filesystem with 4831838208 4k blocks and 301989888 inodes
Filesystem UUID: a3936a9c-da6f-4297-a157-c7256c795fe3
Superblock backups stored on blocks:
 32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632, 2654208,
 4096000, 7962624, 11239424, 20480000, 23887872, 71663616, 78675968,
 102400000, 214990848, 512000000, 550731776, 644972544, 1934917632,
 2560000000, 3855122432

Allocating group tables: done
Writing inode tables: done
Creating journal (262144 blocks): done
Writing superblocks and filesystem accounting information: done
# cat /etc/fstab

#
# /etc/fstab
# Created by anaconda on Mon Sep 26 19:02:55 2022
#
# Accessible filesystems, by reference, are maintained under '/dev/disk/'.
# See man pages fstab(5), findfs(8), mount(8) and/or blkid(8) for more info.
#
# After editing this file, run 'systemctl daemon-reload' to update systemd
# units generated from this file.
#
/dev/mapper/rhel-root   /                       xfs     defaults        0 0
UUID=e86f237d-c42f-4939-9324-b1ff47b3acf6 /boot                   xfs     defaults        0 0
UUID=75CA-D0D9          /boot/efi               vfat    umask=0077,shortname=winnt 0 2
/dev/mapper/rhel-home   /home                   xfs     defaults        0 0
/dev/mapper/rhel-swap   none                    swap    defaults        0 0
/dev/one/vault          /one/vault              xfs     defaults        0 0
/dev/one/media          /one/media              ext4    defaults        0 0


# lsblk
NAME                 MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
sda                    8:0    0  16.4T  0 disk
├─one-vpool0_vdata   253:3    0     6T  0 lvm
│ └─one-vpool0-vpool 253:4    0    18T  0 lvm
│   └─one-media      253:5    0    18T  0 lvm  /one/media
└─one-vpool1_vdata   253:6    0    10T  0 lvm
  └─one-vpool1-vpool 253:7    0    30T  0 lvm
    └─one-vault      253:8    0    30T  0 lvm  /one/vault
sdb                    8:16   0   1.8T  0 disk
└─sdb1                 8:17   0   1.8T  0 part
nvme0n1              259:0    0 465.8G  0 disk
├─nvme0n1p1          259:1    0   600M  0 part /boot/efi
├─nvme0n1p2          259:2    0     1G  0 part /boot
└─nvme0n1p3          259:3    0 464.2G  0 part
  ├─rhel-root        253:0    0    70G  0 lvm  /
  ├─rhel-swap        253:1    0  15.7G  0 lvm  [SWAP]
  └─rhel-home        253:2    0 378.4G  0 lvm  /home
[root@morla ~]#

