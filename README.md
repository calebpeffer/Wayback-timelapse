# Wayback-timelapse
Automatically create GIFS of a website's history


if help - or to see a more userfriendly version of thes, send me a DM on [twitter](https://twitter.com/CalebPeffer) or [linkdln](https://www.linkedin.com/in/caleb-peffer/) and star the repo :)


# Instructions


## Step 1:

Made sure you have node.js, python 3+, and pip installed properly on your system.

## Step 2:

Run

```bash

$ npm install

```

and then

```bash
$ pip install -r requirements.txt

```

(or conda equivalent)

## Step 3:

First, Set the desired url, timerange, and other parameters on line 46 of takeScreenshots.js

then run:

```bash
    node takeScreenshots.js
```

Once thats completed, create the gif with python

```
    python makeGif.py
```

Viola, you should be able to see your gif in the root directory. 

Made it this far? Then Star ⭐

