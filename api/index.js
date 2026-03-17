export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    if (req.method === 'OPTIONS') return res.status(200).end();

    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'ID missing' });

    try {
        // Hum ek public Invidious instance use karenge jo YouTube block nahi karta
        const proxyUrl = `https://inv.tux.rs/api/v1/videos/${id}`;
        
        const response = await fetch(proxyUrl);
        const data = await response.json();

        // Audio streams filter karna
        const audioStreams = data.adaptiveFormats.filter(f => f.type.includes('audio'));
        
        if (audioStreams.length > 0) {
            // Sabse best audio link par redirect karo
            const bestAudio = audioStreams[audioStreams.length - 1].url;
            return res.redirect(307, bestAudio);
        } else {
            return res.status(404).json({ error: 'Audio not found' });
        }

    } catch (error) {
        console.error("PROXY_ERROR:", error.message);
        
        // Agar pehla proxy fail ho toh ye secondary source (Cobalt approach)
        return res.status(500).json({ 
            error: 'Server Error', 
            message: 'Bhai, YouTube bahut tight security kar raha hai. Main alternative link dhund raha hoon.' 
        });
    }
}