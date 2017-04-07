Theta Control
=============

Theta Control is a Javascript script written to control Ricoh Theta S directly with a npm console.

Why Theta Control?
==================

Because sometimes you just want to control a Ricoh Theta out of the box. Because we like to hack stuff. Both reasons are equally valid, actually.

Install:
========

Theta Control uses ThetaSOscClient, fs, EventEmitter and readline. To properly configure the script, please create a folder in your computer to locate the script and its dependencies and then install the script with:

	npm install --save theta-control


Dependencies:
===========

Once installed the script please run:

	npm install

to install the dependencies.

Usage:
======

From the command prompt (Windows) or from Terminal (Osx) navigate into the script folder. 
Theta Control uses just one command to run the script:

	npm run theta

The image will be saved outside the script folder in a newly created "output" folder.

Features:
=========

* You can choose how many pictures you do want to make per each command (asked from the console prompt)
* HDR or Normal.
* Automatic saving of the images on your computer (automatic file transfer).
* Automatic image naming.
* Parametrization of options.
* Destination folder choice.

Coming Soon:
============

* Before-transfer compression to save time.

Working on:
===========

* Before-transfer compression to save time.

Credits:
========
Partly derived from
https://www.npmjs.com/package/osc-client-theta_s