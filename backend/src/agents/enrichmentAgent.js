const { OpenAI } = require('@langchain/openai');

const llm = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-3.5-turbo',
  temperature: 0.7,
});

async function enrichLead(lead) {
  console.log(`Enriching lead: ${lead.name}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate mock email based on the lead's name
  const firstName = lead.name.split(' ')[0].toLowerCase();
  const lastName = lead.name.split(' ')[1]?.toLowerCase() || 'smith';
  
  // Generate different email formats for variety
  const emailFormats = [
    `${firstName}.${lastName}@email.com`,
    `${firstName}${lastName}@company.com`,
    `${firstName}.${lastName}@${lead.company?.toLowerCase().replace(/\s+/g, '') || 'company'}.com`,
    `${firstName}@${lead.company?.toLowerCase().replace(/\s+/g, '') || 'company'}.com`
  ];
  
  const randomEmail = emailFormats[Math.floor(Math.random() * emailFormats.length)];
  
  const enrichedData = {
    email: randomEmail,
    company: lead.company || 'Tech Company',
    position: lead.position || 'Professional',
    linkedin: lead.url || `https://linkedin.com/in/${firstName}${lastName}`
  };
  
  console.log(`Enriched ${lead.name} with email: ${enrichedData.email}`);
  return { ...lead, ...enrichedData };
}

module.exports = { enrichLead };