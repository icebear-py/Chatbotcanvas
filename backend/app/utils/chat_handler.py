import os
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from utils.vectordb_handler import VectorDBHandler

async def chat(query: str, chatbot_id: str):
    try:
        db = VectorDBHandler(chatbot_id)
        faqs_matched = db.search(query)

        faq_prompt = ChatPromptTemplate.from_messages([
            ("system",
             "You are a helpful assistant. Use the provided FAQs to answer the user’s question.\n\n"
             "- Always base your response on the most relevant or semantically similar FAQ.\n"
             "- If there is no exact match, adapt the closest FAQ and give a clear, natural answer.\n"
             "- Do not say that the FAQs do not mention the topic.\n"
             "- Respond only in plain text and elaborate where useful.\n\n"
             "FAQs: {faqs_matched}"),
            ("user", "{query}")
        ])

        llm = ChatOpenAI(
            model=os.getenv("OPENROUTER_LLM_MODEL"),
            api_key=os.getenv("OPENROUTER_API_KEY"),
            base_url="https://openrouter.ai/api/v1",
            streaming=True
        )

        answer_prompt = faq_prompt.format_messages(
            faqs_matched=faqs_matched, query=query
        )

        async for chunk in llm.astream(answer_prompt):
            if chunk.content:
                yield chunk.content

    except Exception as e:
        yield f"Error extracting FAQs: {str(e)}"


