from qdrant_client import QdrantClient, models
from qdrant_client.models import PointStruct, VectorParams
from qdrant_client.models import Filter, FieldCondition, MatchValue
from transformers import AutoTokenizer, AutoModel
import os,uuid
from dotenv import load_dotenv
load_dotenv()

class VectorDBHandler:
    def __init__(self,chatbot_id):
        self.chatbot_id = chatbot_id
        self.collection_name = "faq_embeddings"
        self.client = QdrantClient(
            url=os.getenv("QDRANT_URL"),
            api_key=os.getenv("QDRANT_API_KEY")
        )
        self.tokenizer = AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
        self.model = AutoModel.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
        self._create_collection()

    def _create_collection(self):
        if not self.client.collection_exists(self.collection_name):
            self.client.create_collection(
                collection_name=f"{self.collection_name}",
                vectors_config=models.VectorParams(size=384, distance=models.Distance.COSINE)
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

    def search(self, user_query, chatbot_id):
        vector = self._generate_embedding(user_query)
        chatbot_filter = Filter(
            must=[FieldCondition(key="chatbot_id", match=MatchValue(value=chatbot_id))]
        )
        results = self.client.query_points(collection_name=self.collection_name, query=vector,limit=3)
        return results.points


faqs = [
    {"question": "What is your return policy?", "answer": "You can return items within 30 days."},
    {"question": "Do you ship internationally?", "answer": "Yes, worldwide shipping is available."}
]


db = VectorDBHandler('xyz')
query = "Can i ship my order nationwise?"
print(db.search(query,'xyz'))
