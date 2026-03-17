import ytdl from '@distube/ytdl-core';

export default async function handler(req, res) {
    // 1. CORS Headers for React Native compatibility
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'YouTube ID is missing in query' });
    }

    try {
        const videoURL = `https://www.youtube.com/watch?v=${id}`;

        // 2. Optimized info fetching with User-Agent
        const info = await ytdl.getInfo(videoURL, {
            requestOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    'Accept': '*/*',
                    'Accept-Language': 'en-US,en;q=0.9',
                }
            }
        });

        // 3. Filter for best audio-only stream
        const format = ytdl.chooseFormat(info.formats, { 
            quality: 'highestaudio', 
            filter: 'audioonly' 
        });

        if (format && format.url) {
            // 4. Using 307 Temporary Redirect for better streaming stability
            return res.redirect(307, format.url);
        } else {
            return res.status(404).json({ error: 'Audio stream link not found' });
        }

    } catch (error) {
        console.error("SERVER_ERROR:", error.message);

        // Handle YouTube bot detection block
        if (error.message.includes('403') || error.message.includes('confirm you are not a bot')) {
            return res.status(403).json({ 
                error: 'YouTube Blocked Us', 
                message: 'Server IP restricted by YouTube. Try another video or check later.' 
            });
        }

        return res.status(500).json({ 
            error: 'Internal Server Error', 
            message: error.message 
        });
    }
}