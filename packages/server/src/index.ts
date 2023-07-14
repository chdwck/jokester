import express, { type Request, type Response } from 'express';
import path from 'path';
import axios from 'axios';
import 'dotenv/config';
const app = express();

app.use('/', express.static(path.join(__dirname, '../client')));

const openaiClient = axios.create({
    baseURL: "https://api.openai.com/v1",
    headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
    }
})

const promptPrefix = "Turn the following joke into a safe for work and funny image prompt for Dall-E based on the nouns in the joke. Joke: ";
app.get('/api/v1/dalle-image', async (req: Request, res: Response) => {
    if (!req.query.joke) {
        res.status(400).send('Missing query param: joke');
        return;
    }

    const joke = req.query.joke;
    try {
        const chatCompletion = await openaiClient.post('chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [{ role: "system", content: promptPrefix + joke }],
        })
        const dallePrompt = chatCompletion.data.choices[0].message.content
        const dalleImageRes = await openaiClient.post('images/generations', {
            prompt: dallePrompt,
            size: '512x512',
            n: 1,
            response_format: 'url',
        });
        res.status(200).json(dalleImageRes.data.data[0]);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, './client/dist/index.html'));
});

app.listen(process.env.PORT || 3000, () => console.log(`Server running on port ${process.env.PORT || 3000}`));

