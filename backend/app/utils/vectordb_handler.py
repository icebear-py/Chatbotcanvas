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
db.delete_collection()





