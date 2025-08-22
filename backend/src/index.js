require('dotenv').config({ path: '/Users/dipakdev/Documents/code/personal/ai-ml/langraph/lead-outreach-system/backend/.env' });
const express = require('express');
const cors = require('cors');
const { runPipeline } = require('./orchestrator/mainPipeline');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get('/stream-events', (req, res) => {
  const topic = req.query.topic;
  console.log('Received request for topic:', topic);
  
  if (!topic) {
    console.log('No topic provided');
    return res.status(400).json({ error: 'Topic is required' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendEvent = (data) => {
    console.log('Sending event:', data);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  console.log('Starting pipeline...');
  runPipeline(topic, sendEvent);

  req.on('close', () => {
    console.log('Client disconnected');
    res.end();
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;