import * as React from 'react';
import { sendMessageAndStreamResponse } from './apis/api';
import { ThemeProvider } from "./components/theme-provider";
import { Textarea } from "./components/ui/textarea";
import { Card } from './components/ui/card';
import { Button, buttonVariants } from './components/ui/button';
import './App.css'; // Make sure this contains the necessary styles for your app
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import loadingGif from './assets/loading_1.gif'
import unsealed from './assets/unsealed.webp'


const App: React.FC = () => {
  const [inputMessage, setInputMessage] = React.useState<string>('');
  // const [message, setMessage] = React.useState<string>('');
  const messagesEndRef = React.useRef<null | HTMLDivElement>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showWelcome, setShowWelcome] = React.useState(true);

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

  const handleSendClick = async (e?: React.KeyboardEvent<HTMLTextAreaElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>, messageText?: string) => {
    // Prevent the default action if the function is triggered by a form event
    if (e instanceof KeyboardEvent && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default to avoid a newline being added in the textarea
    }

    let textToSend = inputMessage;
    if (messageText) {
      textToSend = messageText; // Use the message from the card if provided
    }

    if (textToSend.trim() !== '') {
      setInputMessage(''); // Clear the input after sending
      setShowWelcome(false); // Hide the welcome message and suggestions
      await sendMessageAndStreamResponse(textToSend, messageList, setMessageList, scrollToBottom, setIsLoading);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSendClick(e);
    }
  };


  return (
    <ThemeProvider defaultTheme="dark" storageKey="chat-ui-theme">
      {/* <h1 className='absolute top-5 left-5 text-3xl font-thin' style={{ opacity: 0, animation: 'fadeIn 1s ease forwards' }}>Runeterra AI</h1> */}

      <div className='container'>

        <Card className='message-container' style={{ opacity: 0, animation: 'fadeIn 1s ease forwards' }}>

          <div className='flex-1 scroll-container overflow-auto p-4 '
            style={{ opacity: 0, animation: 'fadeIn 1s ease forwards' }}>
            {showWelcome && (
              <div className='flex flex-col items-center absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <img className='w-[64px]' src={unsealed} alt="Unsealed Scroll" />
                <div className='font-bold text-center '>Ask me anything about the Runeterra!</div>
              </div>
            )}

            {messageList.map((msg, index) => (
              <div key={index}>
                {msg.role == 'system' ? <div className='text-left px-4 pb-1 font-bold text-sm'>Runeterra AI</div> : <div className='text-left px-4 pb-1 font-bold text-sm'>Summoner</div>}
                <ReactMarkdown className="markdown-content px-4 text-sm bg-gradient-to-b" remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
              </div>
            ))}
            {isLoading && <img className='w-20 ml-4' src={loadingGif} alt="Loading..." />}



            <div ref={messagesEndRef} />
          </div>

          {showWelcome && (
            <div className='font-semibold mb-4 mx-4 '>
              <div className='flex justify-between mb-4'>
                <Button
                  className={`${buttonVariants({ variant: "outline" })} flex flex-1 mr-2 h-[50px] items-center justify-center text-center text-white`}
                  onClick={() => handleSendClick(undefined, "What are some cool facts about Runeterra?")}
                  style={{ opacity: 0, animation: 'fadeIn 1s ease forwards', animationDelay: '1s' }}>
                  What are some cool facts about Runeterra?
                </Button>
                <Button
                  className={`${buttonVariants({ variant: "outline" })} flex flex-1 ml-2 h-[50px] items-center justify-center text-center text-white`}
                  onClick={() => handleSendClick(undefined, "Who is stronger, Volibear or Gnar?")}
                  style={{ opacity: 0, animation: 'fadeIn 1s ease forwards', animationDelay: '1.25s' }}>
                  Who is stronger, Volibear or Gnar?
                </Button>
              </div>
              <div className='flex justify-between mb-4'>
                <Button
                  className={`${buttonVariants({ variant: "outline" })} flex flex-1 mr-2 h-[50px] items-center justify-center text-center text-white`}
                  onClick={() => handleSendClick(undefined, "What are the religions inside of Runeterra?")}
                  style={{ opacity: 0, animation: 'fadeIn 1s ease forwards', animationDelay: '1.5s' }}>
                  What are the religions inside of Runeterra?
                </Button>
                <Button
                  className={`${buttonVariants({ variant: "outline" })} flex flex-1 ml-2 h-[50px] items-center justify-center text-center text-white`}
                  onClick={() => handleSendClick(undefined, "Who are the Ascendent?")}
                  style={{ opacity: 0, animation: 'fadeIn 1s ease forwards', animationDelay: '1.75s' }}>
                  Who are the Ascendent?
                </Button>
              </div>
            </div>
          )}


          <div className='p-4 border-t border-gray-200 '>
            <div className='flex items-center'>
              <Textarea
                className='flex-1'
                value={inputMessage}
                onChange={handleInputChange}
                placeholder="Type your message..."
                onKeyDown={handleKeyDown}
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