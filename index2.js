const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');

// Menggunakan plugin stealth
puppeteer.use(StealthPlugin());

const wait = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();

    // Menetapkan user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // Menangani permintaan sumber daya
    await page.setRequestInterception(true);
    page.on('request', (request) => {
        if (request.resourceType() === 'image' || request.resourceType() === 'stylesheet') {
            request.abort();
        } else {
            request.continue();
        }
    });

    // Mengunjungi halaman target
    await page.goto('https://jkt48.com', {
        waitUntil: 'networkidle2'
    });

    let waiting = true;
    let retryCount = 0;
    const maxRetries = 20; // Meningkatkan jumlah maksimal percobaan

    while (waiting && retryCount < maxRetries) {
        await wait(30000); // Meningkatkan waktu tunggu

        const currentURL = page.url();
        console.log(`Current URL: ${currentURL}`);

        if (currentURL.includes('cfwaitingroom') || (await page.content()).includes('Please wait while we verify your browser...')) {
            console.log('Still in waiting room...');
            retryCount++;
        } else {
            console.log('Successfully bypassed waiting room.');
            waiting = false;
        }
    }

    if (retryCount >= maxRetries) {
        console.log('Max retries reached, still in waiting room.');
    } else {
        console.log('You can now manually inspect the page and cookies in the browser.');
    }

    // Jangan menutup browser agar Anda bisa memeriksa halaman dan cookies secara manual
    // await browser.close();
})();