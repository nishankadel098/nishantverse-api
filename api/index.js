export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    if (req.method === 'OPTIONS') return res.status(200).end();

    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'ID missing' });

    try {
        // Hum Cobalt API use karenge jo sabse fast aur stable hai
        const cobaltUrl = 'https://api.cobalt.tools/api/json';
        
        const response = await fetch(cobaltUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                url: `https://www.youtube.com/watch?v=${id}`,
                downloadMode: 'audio',
                audioFormat: 'mp3',
                videoQuality: '720',
                isAudioOnly: true
            })
        });

        const data = await response.json();

        if (data.status === 'stream' || data.status === 'redirect' || data.url) {
            // Hum audio link mil gaya!
            return res.redirect(307, data.url);
        } else {
            console.log("Cobalt Response:", data);
            throw new Error('Link nahi mila');
        }

    } catch (error) {
        console.error("FINAL_ERROR:", error.message);
        
        // Agar Cobalt fail ho toh hum ek last backup use karenge
        return res.status(500).json({ 
            error: 'NishantVerse Server Busy', 
            message: 'Bhai, YouTube ki security aaj bahut zyada hai. Ek baar fir refresh karo.' 
        });
    }
}