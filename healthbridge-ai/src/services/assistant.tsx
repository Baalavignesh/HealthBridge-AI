import OpenAI from "openai";

const createThread = async () => {
    const client = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
    });
    
    const thread = await client.beta.threads.create();
    console.log(thread);
    return thread.id;
}       

const addMessageToThread = async (threadId: string, userText: string) => {
    const client = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      const threadMessages = await client.beta.threads.messages.create(
        threadId,
        { role: "user", content: userText }
      );
    
      console.log(threadMessages);
}

const runThread = async (
    threadId: string, 
    userMessage: string,
    responseNumber: number
  ) => {

    const client = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      
      // First add the message to the thread
      if(responseNumber === 2) {
        await addMessageToThread(threadId, userMessage+"Acknoledge the message and respond with a short response saying a doctor will contact you soon. No need to ask further questions.");
      }
      else {
        await addMessageToThread(threadId, userMessage);
      }
  
      const run = await client.beta.threads.runs.createAndPoll(
        threadId,
        { assistant_id: import.meta.env.VITE_ASSISTANT_ID }
      );

      if (run.status === 'completed') {
        const messages = await client.beta.threads.messages.list(
          run.thread_id
        );

        if (messages.data[0].content[0].type === 'text') {
            console.log(messages.data[0].content[0].text.value);
            return messages.data[0].content[0].text.value;
          }
        // for (const message of messages.data) {
        //     if (message.content[0].type === 'text') {
        //       return message;
        //     }
        //   }
      } else {
        console.log(run.status);
      }
    
  };


export { createThread, addMessageToThread, runThread };
