const fs = require('fs');
const readline = require('readline');
const { generateRequestUrl, normaliseResponse } = require('google-translate-api-browser');
const https = require('https');

var filename_to_translate = process.argv[2];

const translateText = (text, language) => {
    return new Promise((resolve, reject) => {
        const url = generateRequestUrl(text, { to: language });

        https.get(url, (resp) => {
            let data = '';

            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                resolve(normaliseResponse(JSON.parse(data)).text);
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
            reject(err);
        });
    });
};


const translateFile = async (filename_to_translate, lang) => {
    const input = 'input/'+filename_to_translate+'.pot';
    const output = 'output/'+filename_to_translate+'-' + lang + '.po';

    const rl = readline.createInterface({
        input: fs.createReadStream(input),
        crlfDelay: Infinity
    });

    const outputFs = fs.createWriteStream(output, { flags: 'a' });  // 'a' flag for append mode

    let lineIndex = 0;
    let prevLine = '';
    for await (const line of rl) {
        if (prevLine.startsWith('msgid') && line.startsWith('msgstr')) {
            console.log(`Translating line ${lineIndex}`)
            const text = prevLine.substring(7, prevLine.length - 1);  // Extract text
            const translated = await translateText(text, lang);
            outputFs.write(`msgstr "${translated}"\n`);
        } else {
            outputFs.write(`${line}\n`);
        }
        prevLine = line;
        lineIndex++;
    }

    outputFs.end();
};

async function translateFiles() {
    await translateFile(filename_to_translate, 'en').catch(console.error);
    await translateFile(filename_to_translate, 'hi').catch(console.error);
    await translateFile(filename_to_translate, 'fr').catch(console.error);
    await translateFile(filename_to_translate, 'es').catch(console.error);
    await translateFile(filename_to_translate, 'ja').catch(console.error);
    await translateFile(filename_to_translate, 'de').catch(console.error);
    await translateFile(filename_to_translate, 'ru').catch(console.error);
    await translateFile(filename_to_translate, 'pt').catch(console.error);
    await translateFile(filename_to_translate, 'ar').catch(console.error);
    await translateFile(filename_to_translate, 'it').catch(console.error);
    await translateFile(filename_to_translate, 'pl').catch(console.error);
    await translateFile(filename_to_translate, 'id').catch(console.error);
    await translateFile(filename_to_translate, 'ko').catch(console.error);
    await translateFile(filename_to_translate, 'zn').catch(console.error);
    await translateFile(filename_to_translate, 'tr').catch(console.error);
    await translateFile(filename_to_translate, 'ur').catch(console.error);
}

translateFiles().catch(console.error);
