const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
const sharp = require('sharp'); // Add this line to use image recognition

puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({
    blockTrackers: true
}));

const wait = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

(async () => {
    const browser = await puppeteer.launch({
        headless: false, // Bisa diubah menjadi true saat produksi
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Opsional, sesuaikan dengan kebutuhan
    });
    const page = await browser.newPage();

    // Set user agent agar terlihat seperti browser biasa
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // Aktifkan interception permintaan
    await page.setRequestInterception(true);
    page.on('request', (request) => {
        if (request.resourceType() === 'image' || request.resourceType() === 'stylesheet' || request.resourceType() === 'font') {
            request.abort();
        } else {
            request.continue();
        }
    });

    // Buka halaman tujuan
    await page.goto('https://jkt48.com', {
        waitUntil: 'networkidle2', // Tunggu sampai tidak ada aktivitas jaringan
    });

    let waiting = true;
    let retryCount = 0;
    const maxRetries = 10; // Maksimal percobaan

    while (waiting && retryCount < maxRetries) {
        await wait(30000); // Tunggu 30 detik

        // Ambil URL dan konten halaman saat ini
        const currentURL = await page.url();
        const pageContent = await page.content();

        // Cek apakah masih di waiting room berdasarkan kondisi tertentu
        if (currentURL.includes('cfwaitingroom') || pageContent.includes('Please wait while we verify your browser...')) {
            console.log('Masih di waiting room...');

            // Tambahkan simulasi aksi pengguna di sini jika diperlukan
            await page.evaluate(() => {
                // Contoh: Klik pada elemen tertentu untuk memicu aktivitas
                document.querySelector('button#verifyButton').click();
            });

            // Bypass human verification using image recognition
            const checkboxImage = await page.screenshot({
                path: 'checkbox.png',
                clip: {
                    x: 100,
                    y: 100,
                    width: 200,
                    height: 200,
                },
            });

            const checkboxBuffer = await sharp('checkbox.png').raw().toBuffer();
            const checkboxImageAnalysis = await sharp(checkboxBuffer).modulate({
                r: 0.5,
                g: 0.5,
                b: 0.5,
            });

            if (checkboxImageAnalysis.data.includes('checkbox')) {
                console.log('Checkbox detected!');
                await page.click('input[type="checkbox"]');
            } else {
                console.log('No checkbox detected...');
            }

            retryCount++;
        } else {
            console.log('Berhasil melewati waiting room.');
            waiting = false;
        }
    }

    // Jika sudah melewati maksimal percobaan
    if (retryCount >= maxRetries) {
        console.log('Maksimal percobaan tercapai, masih di waiting room.');
    } else {
        // Ambil cookies terakhir
        const finalCookies = await page.cookies();
        console.log('Final Cookies:', JSON.stringify(finalCookies, null, 2));

        // Set cookies jika diperlukan sebelum navigasi lebih lanjut
        // Misalnya:
        // await page.setCookie({ name: 'session', value: 'your_session_value', domain: 'example.com' });

        // Lanjutkan ke langkah berikutnya setelah berhasil melewati waiting room
        await page.goto('https://jkt48.com/dashboard', {
            waitUntil: 'networkidle2',
        });

        // Lakukan tindakan selanjutnya di sini
    }

    // Tutup browser
    await browser.close();
})();