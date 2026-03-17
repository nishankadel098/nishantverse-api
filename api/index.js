const ytdl = require('ytdl-core');

export default async function handler(req, res) {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'Bhai, YouTube ID toh bhejo!' });
    }

    try {
        const videoURL = `https://www.youtube.com/watch?v={id}`;
        
        // Sabse best audio stream dhundna
        const info = await ytdl.getInfo(videoURL);
        const audioFormat = ytdl.chooseFormat(info.formats, { 
            quality: 'highestaudio', 
            filter: 'audioonly' 
        });

        if (audioFormat && audioFormat.url) {
            // Hum audio file ko direct redirect kar denge
            res.redirect(audioFormat.url);
        } else {
          res.status(500).send("Audio link nahi mila");
        }
    } catch (error) {
        res.status(500).json({ error: 'Server phat gaya: ' + error.message });
    }
}