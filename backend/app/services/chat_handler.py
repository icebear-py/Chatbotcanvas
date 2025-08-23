from langchain.schema import BaseRetriever, Document
from vectordb_handler import VectorDBHandler
def get_relevant_documents(query,chatbot_id):
    vdb = VectorDBHandler(chatbot_id)
    payloads = vdb.search(query)
    docs = [
        Document(
            page_content=f"{item['question']}\n{item['answer']}",
            metadata=item
        )
        for item in payloads
    ]
    return docs
