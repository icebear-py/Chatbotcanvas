from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
import os,re,json
from dotenv import load_dotenv

load_dotenv()

def extract_faqs_from_text(text: str):
    model = os.getenv("OPENROUTER_LLM_MODEL")
    faq_prompt = ChatPromptTemplate.from_messages([
        ("system", """You are an assistant that extracts FAQs from raw text and HTML text.The FAQs must be in JSON list format with keys 'question' and 'answer'. Return only one single valid JSON list of all FAQs ,if you think of additional FAQs (like website name, product type, contact info), add them to the SAME list."""),
        ("user", "{text}")
    ])

    try:
        llm = ChatOpenAI(
            model=model,
            api_key=os.getenv("OPENROUTER_API_KEY"),
            base_url="https://openrouter.ai/api/v1",
        )
        prompt = faq_prompt.format_messages(text=text)
        results = llm.invoke(prompt)
        return results.content

    except Exception as e:
        print(f"Error extracting FAQs: {str(e)}")
        return []


if __name__ == "__main__":
    txt = """How can I contact Mehar? You can call us at 080-69544000, or you can shoot us an email at: shop@mehar.com You can also get in touch with us LIVE on www.mehar.com
What is Mehar cash ? Mehar Cash is the free virtual money that you earn when you shop or refer friends and family to Mehar. Mehar Cash can be applied as discounts to your shopping cart.
How do I use Mehar cash ? You can use Mehar Cash to pay for 10% of the total amount of your order. Simply select the Mehar Cash during your checkout.
"""
    print(extract_faqs_from_text(txt))
