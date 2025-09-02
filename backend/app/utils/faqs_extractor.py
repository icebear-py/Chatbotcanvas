from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
import os,json
from dotenv import load_dotenv

load_dotenv()

def extract_faqs_from_text(text: str):
    faq_prompt = ChatPromptTemplate.from_messages([
        ("system", """You are an assistant that extracts FAQs from raw text and HTML text.The FAQs must be in JSON list format with keys 'question' and 'answer'. Return only one single valid JSON list of all FAQs,no explanation, no markdown fences. ,if you think of additional FAQs (like website name, product type, contact info), add them to the SAME list."""),
        ("user", "{text}")
    ])

    try:
        llm = ChatOpenAI(
            model=os.getenv("OPENROUTER_LLM_MODEL"),
            api_key=os.getenv("OPENROUTER_API_KEY"),
            base_url="https://openrouter.ai/api/v1",
        )
        prompt = faq_prompt.format_messages(text=text)
        results = llm.invoke(prompt)
        return json.loads(results.content)

    except Exception as e:
        print(f"Error extracting FAQs: {str(e)}")
        return []

