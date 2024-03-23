from llama_index.core.readers import SimpleDirectoryReader

DATA_DIR = "..//documents/Champion Information/"  # directory containing the documents


def get_documents():
    return SimpleDirectoryReader(DATA_DIR, recursive=True).load_data()
