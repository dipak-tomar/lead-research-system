const { StateGraph } = require('@langchain/langgraph');
const { scrapeLeads } = require('../agents/leadScraperAgent');
const { enrichLead } = require('../agents/enrichmentAgent');
const { generateEmail } = require('../agents/emailGeneratorAgent');

// Define state schema
const stateSchema = {
  topic: {
    value: (x, y) => y ?? x,
    default: () => null,
  },
  leads: {
    value: (x, y) => y ?? x,
    default: () => [],
  },
  currentLead: {
    value: (x, y) => y ?? x,
    default: () => null,
  },
  enrichedLead: {
    value: (x, y) => y ?? x,
    default: () => null,
  },
  finalLeads: {
    value: (x, y) => [...(x ?? []), ...(y ?? [])],
    default: () => [],
  },
};

const graph = new StateGraph({ channels: stateSchema });

graph.addNode('scrape', async (state) => {
  const leads = await scrapeLeads(state.topic);
  return { leads };
});

graph.addNode('processLeads', async (state) => {
  const { topic, leads } = state;
  const finalLeads = [];
  
  for (const lead of leads) {
    try {
      // Enrich the lead
      const enrichedLead = await enrichLead(lead);
      
      // Generate email for the enriched lead
      const finalLead = await generateEmail(enrichedLead, topic);
      
      finalLeads.push(finalLead);
    } catch (error) {
      console.error('Error processing lead:', error);
      // Add the lead with error info
      finalLeads.push({
        ...lead,
        email: 'unknown@example.com',
        company: 'Unknown',
        position: 'Unknown',
        linkedin: 'N/A',
        emailContent: 'Error generating email content',
        subject: 'Follow-up'
      });
    }
  }
  
  return { ...state, finalLeads };
});

graph.addEdge('scrape', 'processLeads');

graph.setEntryPoint('scrape');
graph.setFinishPoint('processLeads');

const workflow = graph.compile();

async function runPipeline(topic, sendEvent) {
  const initialState = { topic, leads: [], currentLead: null, enrichedLead: null, finalLeads: [] };
  
  try {
    // First scrape leads
    console.log('Starting pipeline for topic:', topic);
    sendEvent({ type: 'status', message: 'Scraping leads...' });
    const leads = await scrapeLeads(topic);
    console.log('Scraped leads:', leads.length);
    
    if (leads.length === 0) {
      console.log('No leads found');
      sendEvent({ type: 'status', message: 'No leads found for this topic.' });
      sendEvent({ type: 'done' });
      return;
    }
    
    sendEvent({ type: 'status', message: `Found ${leads.length} leads. Processing...` });
    
    // Process each lead individually and send events
    for (let i = 0; i < leads.length; i++) {
      const lead = leads[i];
      try {
        sendEvent({ type: 'status', message: `Processing lead ${i + 1}/${leads.length}: ${lead.name}` });
        
        // Enrich the lead
        const enrichedLead = await enrichLead(lead);
        
        // Generate email for the enriched lead
        const finalLead = await generateEmail(enrichedLead, topic);
        
        // Send the completed lead
        sendEvent({ type: 'lead', lead: finalLead });
      } catch (error) {
        console.error('Error processing lead:', error);
        // Send the lead with error info
        const errorLead = {
          ...lead,
          email: 'unknown@example.com',
          company: 'Unknown',
          position: 'Unknown',
          linkedin: 'N/A',
          emailContent: 'Error generating email content',
          subject: 'Follow-up'
        };
        sendEvent({ type: 'lead', lead: errorLead });
      }
    }
    
    sendEvent({ type: 'done' });
  } catch (error) {
    console.error('Pipeline error:', error);
    sendEvent({ type: 'error', message: error.message });
  }
}

module.exports = { runPipeline };