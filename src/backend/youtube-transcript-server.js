import express from 'express';
import cors from 'cors';
import { YoutubeTranscript } from 'youtube-transcript';

const app = express();
const port = 5000;

app.use(cors());

app.get('/transcript/:videoId', async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    res.json(transcript);
  } catch (err) {
    res.status(500).send('Failed to fetch transcript');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
