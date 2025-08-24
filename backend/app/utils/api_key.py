import secrets
from vectordb_handler import VectorDBHandler
from qdrant_client.models import Filter,MatchValue,FieldCondition


def generate_api_key() -> str:
    return "cb_canvas_" + secrets.token_urlsafe(32)


def is_valid_api_key(chatbot_id: str) -> bool:
    db = VectorDBHandler("xyz")
    chatbot_filter = Filter(
        must=[FieldCondition(key="chatbot_id", match=MatchValue(value=chatbot_id))]
    )
    result = db.client.scroll(
        collection_name=db.collection_name,
        limit=1,
        with_payload=False,
        scroll_filter=chatbot_filter
    )
    return len(result[0]) > 0
