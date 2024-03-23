import { Dispatch, SetStateAction } from "react";

export const sendMessageAndStreamResponse = async (
  message: string,
  messageList: Array<{ role: string; content: string }>,
  setMessageList: Dispatch<SetStateAction<{ role: string; content: string; }[]>>,
  scrollToBottom: (() => void),
  setIsLoading: Dispatch<SetStateAction<boolean>>
): Promise<void> => {
  setIsLoading(true); // Start loading
  const userMessage = { role: "user", content: message };
  setMessageList(prev => [...prev, userMessage]);

  // Add a placeholder system message to be updated in real time
  setMessageList(prev => [...prev, { role: "system", content: "" }]);

  try {

    const response = await fetch('http://localhost:8000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: messageList.concat(userMessage) }),
    });

    const reader = response.body?.getReader();
    if (reader) {
      const decoder = new TextDecoder();
      let accumulatedText = '';

      const read = async () => {
        const { done, value } = await reader.read();
        if (done) {
          // Final update or cleanup could go here
          return;
        }

        // Accumulate decoded text
        accumulatedText += decoder.decode(value, { stream: true });

        // Update the placeholder system message with accumulated text in real time
        setMessageList(prev => {
          const updated = [...prev];
          setIsLoading(false); // Stop loading when done
          if (updated.length > 0) {
            updated[updated.length - 1] = { role: "system", content: preprocessText(accumulatedText) };
          }
          return updated;
        });

        scrollToBottom(); // Scroll to bottom after updating the content

        read(); // Continue reading the next chunk
      };

      read();
    }
  } catch (error) {
    setIsLoading(false);
    console.error("Fetch error:", error);
    setMessageList(prev => {
      const updated = [...prev];
      if (updated.length > 0) {
        updated[updated.length - 1] = { role: "system", content: "There was an error with the server." };
      }
      return updated;
    });
    scrollToBottom();
  }




};

const preprocessText = (text: string) => {
  // Remove line breaks that incorrectly break words
  let processedText = text.replace(/-\n/g, '');
  // Replace multiple line breaks with a single one or spaces as needed
  processedText = processedText.replace(/\n+/g, '\n');
  // Further processing can be done here if needed

  return processedText;
};