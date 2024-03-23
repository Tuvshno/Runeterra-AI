import * as React from 'react';
import { sendMessageAndStreamResponse } from './apis/api';
import { ThemeProvider } from "./components/theme-provider";
import { Textarea } from "./components/ui/textarea";
import { Card } from './components/ui/card';
import { Button } from './components/ui/button';
import './App.css'; // Make sure this contains the necessary styles for your app
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import loadingGif from './assets/loading_1.gif'

const App: React.FC = () => {
  const [inputMessage, setInputMessage] = React.useState<string>('');
  // const [message, setMessage] = React.useState<string>('');
  const messagesEndRef = React.useRef<null | HTMLDivElement>(null);
  const [isLoading, setIsLoading] = React.useState(false);


  const [messageList, setMessageList] = React.useState<Array<{ role: string; content: string }>>([]);

  React.useEffect(() => {
    if (isLoading) {
      // Set a timeout to allow time for the image to render/load
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 100); // 100ms delay; adjust as needed based on your loading image size and network speed
  
      // Clear the timeout if the component unmounts or isLoading changes before the timeout completes
      return () => clearTimeout(timer);
    }
  }, [isLoading]);
  

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
  };

  const handleSendClick = async () => {
    if (inputMessage.trim() !== '') {
      setInputMessage(''); // Clear the input after sending
      console.log(messageList)
      scrollToBottom
      await sendMessageAndStreamResponse(inputMessage, messageList, setMessageList, scrollToBottom, setIsLoading);
      console.log(messageList)
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="chat-ui-theme">
      <div className='container'>
        <Card className='message-container'>

          <div className='flex-1 scroll-container overflow-auto p-4 '>
            {messageList.map((msg, index) => (
              <div key={index}>
                {msg.role == 'system' ? <div className='text-left px-4 pb-1 font-bold text-sm'>Runeterra AI</div> : <div className='text-left px-4 pb-1 font-bold text-sm'>Summoner</div>}
                <ReactMarkdown className="markdown-content px-4 text-sm" remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
              </div>
            ))}
            {isLoading && <img className='w-20 ml-4' src={loadingGif} alt="Loading..."  />}

            <div ref={messagesEndRef} />
          </div>


          <div className='p-4 border-t border-gray-200 '>
            <div className='flex items-center'>
              <Textarea
                className='flex-1'
                value={inputMessage}
                onChange={handleInputChange}
                placeholder="Type your message..."
              />
              <Button className='ml-4' onClick={handleSendClick}>Send</Button>
            </div>
          </div>
        </Card>
      </div>
    </ThemeProvider>
  );
}

export default App;