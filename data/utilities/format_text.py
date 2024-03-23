import os
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage

# Base directory where champion information folders are stored
base_directory = '../documents/Champion Information/'

# Mistral API key and model
api_key = os.getenv("MISTRAL_API_KEY")
model = "open-mistral-7b"

print("Initializing the Mistral client...")
client = MistralClient(api_key=api_key)

def format_text_streaming(text):
    """Send text to Mistral for formatting and return the formatted text using streaming."""
    print("Preparing to format text using streaming...")
    messages = [ChatMessage(role="user", content=f"Format this text. Do not remove any text, only format it. \n\n{text}")]
    formatted_text = ""

    # With streaming
    stream_response = client.chat_stream(model=model, messages=messages)

    print("Receiving streamed response...")
    for chunk in stream_response:
        if chunk.choices and chunk.choices[0].delta:
            formatted_text += chunk.choices[0].delta.content
            print(f"\rCurrent formatted text length: {len(formatted_text)}", end='')

    print("\nCompleted receiving streamed content.")  # Newline to move to the next line after progress update
    return formatted_text

# Iterate over each text file in the champion information folders
for dirpath, dirnames, filenames in os.walk(base_directory):
    for filename in filenames:
        if filename.endswith('.txt'):
            file_path = os.path.join(dirpath, filename)
            print(f"\nProcessing file: {file_path}")
            
            # Read the content of the text file
            with open(file_path, 'r', encoding='utf-8') as file:
                original_text = file.read()
            
            print("Sending text to Mistral for formatting...")
            # Send the content to Mistral for formatting using streaming
            formatted_text = format_text_streaming(original_text)
            
            if formatted_text:
                # Write the formatted text back to the file
                with open(file_path, 'w', encoding='utf-8') as file:
                    file.write(formatted_text)
                print(f"\nFormatted text saved for: {file_path}")
            else:
                print("\nFailed to format text or received empty response.")

print("\nAll files processed.")
