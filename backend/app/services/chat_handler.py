import os
from langchain.prompts.chat import ChatPromptTemplate
from vectordb_handler import VectorDBHandler
from langchain.chat_models import ChatOpenAI

def chat(query,chatbot_id):
    try:
        db = VectorDBHandler(chatbot_id)
        faqs_matched = db.search(query)
        faq_prompt = ChatPromptTemplate.from_messages([
            ("system","You are an helpful assistant. Based on the provided faqs answer to user's questions in plain text and try elaborating.   FAQs  {faqs_matched}"),
            ("user", "{query}")
        ])
        llm = ChatOpenAI(
            model=os.getenv('OPENROUTER_LLM_MODEL'),
            api_key=os.getenv("OPENROUTER_API_KEY"),
            base_url="https://openrouter.ai/api/v1",
            streaming=True
        )
        answer_prompt = faq_prompt.format_messages(faqs_matched=faqs_matched,query=query)
        for chunk in llm.stream(answer_prompt):
            if chunk.content:
                yield chunk.content

    except Exception as e:
        print(f"Error extracting FAQs: {str(e)}")
        return str(e)


print()
for token in chat('im not available to collect my order , what should i do?','xyz'):
    print(token, end="", flush=True)



