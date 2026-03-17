export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    if (req.method === 'OPTIONS') return res.status(200).end();

    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Bhai, YouTube ID missing hai' });

    // Ye saare Piped ke top-tier working instances hain
    const pipedInstances = [
        'https://pipedapi.kavin.rocks',
        'https://pipedapi.smnz.de',
        'https://pipedapi.adminforge.de',
        'https://piped-api.lunar.icu'
    ];

    for (const instance of pipedInstances) {
        try {
            console.log(`Trying Piped instance: ${instance}`);
            
            const response = await fetch(`${instance}/streams/${id}`, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' },
                signal: AbortSignal.timeout(6000) // 6 second timeout
            });

            if (!response.ok) continue;

            const data = await response.json();

            // Piped humein ekdum clean audio streams deta hai
            if (data.audioStreams && data.audioStreams.length > 0) {
                // Mobile app ke liye mp4/m4a sabse best aur fast hota hai
                const bestAudio = data.audioStreams.find(stream => stream.mimeType.includes('mp4')) || data.audioStreams[0];
                
                // Direct Vercel se audio link par redirect
                return res.redirect(307, bestAudio.url);
            }
        } catch (error) {
            console.log(`Failed at ${instance}, trying next...`);
            continue;
        }
    }

    // Agar Vercel ne sab kuch block kar diya ho
    return res.status(500).json({ 
        error: "NishantVerse Server Blocked", 
        message: "Bhai, Piped ke saare servers ne Vercel ko block kar diya. Humein render.com ya apna custom backend lagana padega." 
    });
}