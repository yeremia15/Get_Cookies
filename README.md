# Waiting Room Bypass


This repository contains a script to bypass the waiting room on the website and obtain the final cookies.

## About
This script uses Puppeteer to automate the browsing process and bypass the waiting room. It also uses image recognition to detect and click on the checkbox required for human verification.

## Installation
To run this script, you need to have Node.js installed on your machine. You also need to install the required dependencies by running the following command:

```npm install puppeteer puppeteer-extra puppeteer-extra-plugin-stealth puppeteer-extra-plugin-adblocker sharp axios```

## Usage
To run the script, simply execute the following command:

```node index.js``` {get final cookies} // 
```node index2.js``` {open and stay on the open web} //
```node bypass.js``` {bypass a cloudflare waiting room using axios}

The script will launch a headless browser instance, navigate to the website, and attempt to bypass the waiting room. If successful, it will obtain the final cookies and print them to the console.

## Note
This script is for educational purposes only and should not be used for malicious activities.

## Contributing
If you want to contribute to this repository, please fork it and submit a pull request.

## Credits
This script was developed using the following resources:

* Puppeteer: https://pptr.dev/
* Puppeteer-extra: https://github.com/thecodechef/puppeteer-extra
* Sharp: https://sharp.pixelplumbing.com/
* Axios: https://axios-http.com/docs/intro

Copyright 2024 @yeremia15 {Yeremia Yosia Robert}. All Rights Reserved.
