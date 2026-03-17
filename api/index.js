import ytdl from '@distube/ytdl-core';

export default async function handler(req, res) {
    // 1. CORS Headers for App compatibility
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'Bhai, YouTube ID (id) query mein bhejo!' });
    }

    try {
        const videoURL = `https://www.youtube.com/watch?v=${id}`;

        // Tumhari Cookies (Bypassing Bot Detection)
        const COOKIE_STRING = "HSID=AuGaMDL51QkvpzzNK; SSID=A_cgR8mpmuGQ7G8KJ; APISID=JIfBRMXx40G_Q6ch/ADe19cZjYTZ-ePzUf; SAPISID=KEektD4vVrNn7UTB/AE3_1kTuVyrooSqSZ; __Secure-1PAPISID=KEektD4vVrNn7UTB/AE3_1kTuVyrooSqSZ; __Secure-3PAPISID=KEektD4vVrNn7UTB/AE3_1kTuVyrooSqSZ; LOGIN_INFO=AFmmF2swRQIhAOuEGX2W-kqGzMGG0d-AjQJ7k5ENfkHd_4Z7aNA-jAkTAiBjg3A9bBl-VyMGyQUwIT5BM2bmM6nfgsMKnj_TIvx1SA:QUQ3MjNmeERLaEFhc21CclpVekpaUHZqVENWd2RZa0hRQmE4TWJGRjZoWUtFd2g1OW8za1FqTVlxMXlTMURMcEZBbXlXZWpXcUhud05sQzZzR2VCa0lpYmJ0ck1pQzFBMU40WGUzX2hqWEJlcG1NanVUV2VRaUJRdVlIeU15MkRZd21KdW5pS0xOS1lBcHIwRVZkQ1JxYm9iZGhsTl9XZWZB; PREF=f4=4000000&f6=40000000&tz=Asia.Calcutta&f7=150; SID=g.a0007whHaEW2UUmKlEnBraTzVFapeKTIsqiskEQWLJw7iyHRUGWIMtRe7pMavDd2jpRHZEkeFQACgYKAfUSARQSFQHGX2MieUfUgWyRZ_6h7XDu3IJCQBoVAUF8yKoF8m6Jo5JCtvDnfoSpRDaA0076; __Secure-1PSID=g.a0007whHaEW2UUmKlEnBraTzVFapeKTIsqiskEQWLJw7iyHRUGWIrVFkZtK8CpEy-CIGyjpkHQACgYKAVwSARQSFQHGX2Mi-KEEY3NPgUWMzjpr_3MCnxoVAUF8yKqQWXimh4RZZqOdyq_k-MOL0076; __Secure-3PSID=g.a0007whHaEW2UUmKlEnBraTzVFapeKTIsqiskEQWLJw7iyHRUGWIMCi4PYSv7RBPTohZp_ACXQACgYKAUkSARQSFQHGX2MiHQNSf9ueJjH_JA7gudrpdRoVAUF8yKpkN2SgyUGswllVbiQXQhjt0076; VISITOR_INFO1_LIVE=CgOTXS1F9V0; YSC=IQCpC0-HPZA";

        const info = await ytdl.getInfo(videoURL, {
            requestOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    'Cookie': COOKIE_STRING,
                    'Accept': '*/*',
                    'Accept-Language': 'en-US,en;q=0.9',
                }
            }
        });

        const format = ytdl.chooseFormat(info.formats, { 
            quality: 'highestaudio', 
            filter: 'audioonly' 
        });

        if (format && format.url) {
            return res.redirect(307, format.url);
        } else {
            return res.status(404).json({ error: 'Audio stream link not found' });
        }

    } catch (error) {
        console.error("DEBUG:", error.message);
        return res.status(500).json({ 
            error: 'Server Error', 
            message: error.message 
        });
    }
}