from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from app.utils.chat_handler import chat

router = APIRouter()

@router.post("/chat")
async def chat_endpoint(request: Request):
    data = await request.json()
    #print(data)
    query = data.get("query")
    api_key = data.get("api_key")

    if not api_key or not query:
        return {'error':'Missing query or api_key'}

    async def chat_stream():
        async for chunk in chat(query, api_key):
            yield chunk

    return StreamingResponse(chat_stream(), media_type="text/plain")

