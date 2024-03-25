## Runeterra AI

Runeterra AI is a RAG LLM Chatbot that is an expert in the League of Legends world, Runeterra. 

### Architecture

Runeterra AI uses a RAG Architecture comprised of these steps:
- Condensing a conversation and latest user message to a standalone question
- Building a context for the standalone question by querying the vector database
- Then pass the context along with prompt and user message to LLM to generate a response

This approach was used because the purpose of Runeterra AI is directly related to the knowledge vector database and general interactions with the users.

### Data

Data was scraped and formatted using reliable lore sources such as the League of Legends Wiki and Official League of Legends Website.

`data/utilities` folder contains code for how I scraped data, generating embeddings, and upserted them into the database. 

The `data/documents` folder contains the documents that were embedded into the Pinecone Vector Database. It currently holds data on:
- Champion Information
- Champion Lore
- Runeterra Lore
- Runeterra Events
- Runeterra Locations
- Runeterra Short Stories
- Runeterra Species

The database is still growing, which means the bot is getting better and better.

`runeterra-backend` contains the backend FastAPI and RAG LLM implementation.

`runeterra-frontend` contains the frontend React code for the Chat UI.

### Why 

This was a fun project for me to build a full RAG Application which included:
- Finding and processing documents into a vector database
- Implementing the RAG System into the LLM
- Building a functional frontend and backend
- Deploying to the cloud.

These were the technologies used in this project:
- OpenAI
- Pinecone
- React
- Python 
