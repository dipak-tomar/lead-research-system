import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Paper, CircularProgress, List, ListItem, ListItemText, Divider } from '@material-ui/core';

function App() {
  const [topic, setTopic] = useState('');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');
  const [sse, setSse] = useState(null);

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    setLeads([]);
    setStatus('');

    const eventSource = new EventSource(`http://localhost:5001/stream-events?topic=${topic}`);
    setSse(eventSource);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'lead') {
        setLeads(prevLeads => [...prevLeads, data.lead]);
      } else if (data.type === 'status') {
        setStatus(data.message);
      } else if (data.type === 'error') {
        setError(data.message);
        setLoading(false);
        setStatus('');
        eventSource.close();
      } else if (data.type === 'done') {
        setLoading(false);
        setStatus('Completed!');
        eventSource.close();
      }
    };

    eventSource.onerror = (err) => {
      setError('Error connecting to the server.');
      setLoading(false);
      eventSource.close();
    };
  };

  useEffect(() => {
    return () => {
      if (sse) {
        sse.close();
      }
    };
  }, [sse]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        AI Lead Research & Outreach Agent
      </Typography>
      <Paper style={{ padding: '20px', marginBottom: '20px' }}>
        <TextField
          label="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleStart} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Start Research'}
        </Button>
      </Paper>

      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}

      {status && (
        <Typography color="primary" gutterBottom>
          {status}
        </Typography>
      )}

      {leads.length > 0 && (
        <Paper style={{ padding: '20px' }}>
          <Typography variant="h5" gutterBottom>
            Generated Leads & Emails
          </Typography>
          <List>
            {leads.map((lead, index) => (
              <React.Fragment key={index}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={lead.name}
                    secondary={
                      <div>
                        <div><strong>Company:</strong> {lead.company}</div>
                        <div><strong>Position:</strong> {lead.position}</div>
                        <div><strong>Email:</strong> {lead.email}</div>
                        <div><strong>LinkedIn:</strong> <a href={lead.linkedin} target="_blank" rel="noopener noreferrer">{lead.linkedin}</a></div>
                        {lead.subject && (
                          <div style={{ marginTop: '10px' }}>
                            <strong>Email Subject:</strong> {lead.subject}
                          </div>
                        )}
                        {lead.emailContent && (
                          <div style={{ marginTop: '10px' }}>
                            <strong>Email Content:</strong>
                            <div style={{ 
                              backgroundColor: '#f5f5f5', 
                              padding: '10px', 
                              marginTop: '5px', 
                              borderRadius: '4px',
                              whiteSpace: 'pre-wrap',
                              fontSize: '0.9em'
                            }}>
                              {lead.emailContent}
                            </div>
                          </div>
                        )}
                      </div>
                    }
                  />
                </ListItem>
                <Divider style={{ margin: '20px 0' }} />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Container>
  );
}

export default App;