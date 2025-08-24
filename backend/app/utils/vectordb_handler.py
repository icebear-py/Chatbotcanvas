from qdrant_client import QdrantClient, models
from qdrant_client.models import Filter, FieldCondition, MatchValue
from transformers import AutoTokenizer, AutoModel
import os,uuid,warnings
from dotenv import load_dotenv
load_dotenv()

warnings.filterwarnings("ignore", category=FutureWarning)
class VectorDBHandler:
    def __init__(self,chatbot_id):
        self.chatbot_id = chatbot_id
        self.collection_name = "faq_embeddings"
        self.client = QdrantClient(
            url=os.getenv("QDRANT_URL"),
            api_key=os.getenv("QDRANT_API_KEY")
        )
        self.tokenizer = AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2", local_files_only=True)
        self.model = AutoModel.from_pretrained("sentence-transformers/all-MiniLM-L6-v2", local_files_only=True)
        self._create_collection()

    def _create_collection(self):
        if not self.client.collection_exists(self.collection_name):
            self.client.create_collection(
                collection_name=f"{self.collection_name}",
                vectors_config=models.VectorParams(size=384, distance=models.Distance.COSINE),
                optimizers_config=models.OptimizersConfigDiff(default_segment_number=1),
                hnsw_config=None,
                on_disk_payload=False
            )
            self.client.create_payload_index(
                collection_name=self.collection_name,
                field_name="chatbot_id",
                field_schema=models.PayloadSchemaType.KEYWORD
            )

    def _generate_embedding(self, text):
        inputs = self.tokenizer(text, return_tensors="pt")
        outputs = self.model(**inputs)
        embeddings = outputs.last_hidden_state.mean(dim=1)
        vector = embeddings.detach().cpu().numpy().tolist()[0]
        return vector

    def upsert_faqs(self, faq_list):
        points = []
        for faq in faq_list:
            vector = self._generate_embedding(faq["question"])
            points.append({
                "id": str(uuid.uuid4()),
                "vector": vector,
                "payload": {
                    "chatbot_id": self.chatbot_id,
                    "question": faq['question'],
                    "answer": faq['answer']
                }
            })
        self.client.upsert(collection_name=self.collection_name, points=points)

    def delete_collection(self):
        self.client.delete_collection(collection_name=self.collection_name)

    def search(self, user_query):
        vector = self._generate_embedding(user_query)
        chatbot_filter = Filter(
            must=[FieldCondition(key="chatbot_id", match=MatchValue(value=self.chatbot_id))]
        )
        resultpnt = self.client.query_points(collection_name=self.collection_name, query=vector,limit=3,with_payload=True,query_filter=chatbot_filter)
        return [point.payload for point in resultpnt.points]





db = VectorDBHandler('xyz')
faq_list = [
  {
    "question": "How can I contact Mehar?",
    "answer": "You can call us at 080-69544000, email us at shop@mehar.com or get in touch LIVE on www.mehar.com."
  },
  {
    "question": "What is Mehar Cash?",
    "answer": "Mehar Cash is the free virtual money you earn when you shop or refer friends and family to Mehar. It can be applied as a discount to your shopping cart."
  },
  {
    "question": "How do I use Mehar Cash?",
    "answer": "You can use Mehar Cash to pay for 10% of the total amount of your order. Simply select the Mehar Cash option during checkout."
  },
  {
    "question": "Can I withdraw or use Mehar Cash anywhere else?",
    "answer": "No, Mehar Cash can only be used on www.mehar.com."
  },
  {
    "question": "How would I know if my order has been successfully placed?",
    "answer": "Once your payment is authorized and the order is placed, you will receive a confirmation email that includes your order number, order details, and the amount paid. You will also receive a confirmation call from our Customer Support Team. After confirming the details, the order is processed for dispatch."
  },
  {
    "question": "How can I track my order?",
    "answer": "After your order has been dispatched, an email with tracking details and the name of the courier company will be sent to you. If you have not received the product within 5 working days after receiving the tracking details, please contact us at 080-69544000 or email shop@mehar.com."
  },
  {
    "question": "Can I change my shipping address or mobile number after the order is placed?",
    "answer": "Once your order is placed, our Customer Support Team will call you to confirm the delivery address. You can inform them of any desired changes. The address can be changed only if the order is placed within India. For an international order, the delivery address cannot be changed to an Indian address."
  },
  {
    "question": "What should I do if my order is missing an item?",
    "answer": "Missing items are often due to the order being dispatched in separate parcels. For COD orders, no more than three items are dispatched at once. For prepaid orders, all items are dispatched in a single parcel."
  },
  {
    "question": "What should I do if I receive a damaged product?",
    "answer": "Shipments undergo intensive quality checks before leaving our factory, but damage can occur during transit. Please write to us at shop@mehar.com or call 080-69544000. Our customer support team will assist you. Working hours are 8 am–8 pm, Monday–Sunday. Discrepancies reported more than 48 hours after delivery are not entertained."
  },
  {
    "question": "What should I do if I am not available to collect my order?",
    "answer": "If you cannot collect your order, please contact us at shop@mehar.com or call 080-69544000 during our working hours (8 am–8 pm, Monday–Sunday) for assistance."
  },
  {
    "question": "What are the modes of payment for purchases on Mehar?",
    "answer": "We accept COD, Debit Card, Credit Card, Net Banking, and UPI."
  },
  {
    "question": "Is there any hidden cost (sales tax, octroi, etc.) on items sold by Mehar?",
    "answer": "No, there is no hidden cost on items sold by Mehar."
  }
]
db.upsert_faqs(faq_list)




