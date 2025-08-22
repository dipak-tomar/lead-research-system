const { OpenAI } = require('@langchain/openai');

const llm = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-3.5-turbo',
  temperature: 0.7,
});

async function generateEmail(lead, topic) {
  const prompt = `Write a personalized cold outreach email for ${lead.name} at ${lead.company} about ${topic}. The email should be professional, concise, and personalized based on their role as ${lead.position}. Include a clear call-to-action. Make it engaging and relevant to their business.`;
  
  try {
    const emailContent = await llm.invoke(prompt);
    return {
      ...lead,
      emailContent,
      subject: `Quick question about ${topic}`,
    };
  } catch (error) {
    console.error('Error generating email:', error);
    return {
      ...lead,
      emailContent: 'Error generating email content',
      subject: 'Follow-up',
    };
  }
}

module.exports = { generateEmail };