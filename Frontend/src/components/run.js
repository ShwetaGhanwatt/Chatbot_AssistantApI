
import axios from 'axios';

export const run = async (threadId,assistant_id) => {
      const apiKey = process.env.REACT_APP_API_KEY; 
      try {
        const response = await axios.post(`https://api.openai.com/v1/threads/${threadId}/runs`,
        {
            "assistant_id": assistant_id
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v1',
          },
        })
        }catch(error){
            console.log(error)
        }
        
}