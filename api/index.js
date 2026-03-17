import ytdl from '@distube/ytdl-core';

export default async function handler(req, res) {
    // 1. CORS Headers
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

        // Tumhari Cookies ko array format mein convert kiya gaya hai behtar stability ke liye
        const cookieArray = [
            { name: "HSID", value: "AuGaMDL51QkvpzzNK" },
            { name: "SSID", value: "A_cgR8mpmuGQ7G8KJ" },
            { name: "APISID", value: "JIfBRMXx40G_Q6ch/ADe19cZjYTZ-ePzUf" },
            { name: "SAPISID", value: "KEektD4vVrNn7UTB/AE3_1kTuVyrooSqSZ" },
            { name: "LOGIN_INFO", value: "AFmmF2swRQIhAOuEGX2W-kqGzMGG0d-AjQJ7k5ENfkHd_4Z7aNA-jAkTAiBjg3A9bBl-VyMGyQUwIT5BM2bmM6nfgsMKnj_TIvx1SA:QUQ3MjNmeERLaEFhc21CclpVekpaUHZqVENWd2RZa0hRQmE4TWJGRjZoWUtFd2g1OW8za1FqTVlxMXlTMURMcEZBbXlXZWpXcUhud05sQzZzR2VCa0lpYmJ0ck1pQzFBMU40WGUzX2hqWEJlcG1NanVUV2VRaUJRdVlIeU15MkRZd21KdW5pS0xOS1lBcHIwRVZkQ1JxYm9iZGhsTl9XZWZB" },
            { name: "VISITOR_INFO1_LIVE", value: "CgOTXS1F9V0" },
            { name: "YSC", value: "IQCpC0-HPZA" },
            { name: "SID", value: "g.a0007whHaEW2UUmKlEnBraTzVFapeKTIsqiskEQWLJw7iyHRUGWIMtRe7pMavDd2jpRHZEkeFQACgYKAfUSARQSFQHGX2MieUfUgWyRZ_6h7XDu3IJCQBoVAUF8yKoF8m6Jo5JCtvDnfoSpRDaA0076" }
        ];

        // Creating an authenticated agent
        const agent = ytdl.createAgent(cookieArray);

        // 2. Info fetching using the agent
        const info = await ytdl.getInfo(videoURL, { agent });

        // 3. Choosing highest quality audio
        const format = ytdl.chooseFormat(info.formats, { 
            quality: 'highestaudio', 
            filter: 'audioonly' 
        });

        if (format && format.url) {
            // 307 Redirect is the most reliable for Vercel functions
            return res.redirect(307, format.url);
        } else {
            return res.status(404).json({ error: 'Audio stream link nahi mila bhai' });
        }

    } catch (error) {
        console.error("DEBUG_LOG:", error.message);
        
        // Agar abhi bhi bot detection aaye, toh ye clear error dikhayega
        return res.status(500).json({ 
            error: 'Server Error', 
            message: error.message,
            tip: "Bhai, agar bot detection aa raha hai toh server ka IP badalna padega ya Proxy use karni hogi."
        });
    }
}