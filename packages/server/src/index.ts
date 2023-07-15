import express, { type Request, type Response } from 'express';
import path from 'path';
import axios from 'axios';
import 'dotenv/config';
import HitpointCache from './HitpointCache';

const app = express();

app.use('/', express.static(path.join(__dirname, '../client')));

const openaiClient = axios.create({
  baseURL: "https://api.openai.com/v1",
  headers: {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    "Content-Type": "application/json",
  }
})

const TWO_WEEKS_MS = 1000 * 60 * 60 * 24 * 7 * 2;

const cache = new HitpointCache(10, TWO_WEEKS_MS);
const promptPrefix = "Turn the following joke into a safe for work and funny image prompt for Dall-E based on the nouns in the joke. Please response under 20 words. Do not include text in the images. Do not include text in the images. Don't mention humor in the prompt. Joke: ";
app.get('/api/v1/dalle-image', async (req: Request, res: Response) => {
  if (!req.query.joke) {
    res.status(400).send('Missing query param: joke');
    return;
  }

  const joke = req.query.joke;
  if (typeof joke !== 'string') {
    res.status(400).send('Invalid Query Param: joke must be a string')
    return;
  }

  try {
    let cacheHit = true;
    let dallePrompt = cache.getItem(joke);

    if (!dallePrompt) {
      cacheHit = false;
      const chatCompletion = await openaiClient.post('chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [{ role: "system", content: promptPrefix + joke }],
      });

      const choices = chatCompletion?.data?.choices ?? [];
      dallePrompt = choices[0]?.message?.content;
      if (!dallePrompt) {
        throw new Error("Chat completion failed. Failed to create DallE prompt");
      }

      cache.addItem(joke, dallePrompt);
    }
    const dalleImageRes = await openaiClient.post('images/generations', {
      prompt: dallePrompt,
      size: '512x512',
      n: 1,
      response_format: 'url',
    });
    if (cacheHit) {
      res.set("x-cache-status", cacheHit ? "HIT" : "MISS")
    }
    res.status(200).json(dalleImageRes.data.data[0]);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
  cache.cleanCache();
});

app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(process.env.PORT || 3000, () => console.log(`Server running on port ${process.env.PORT || 3000}`));

