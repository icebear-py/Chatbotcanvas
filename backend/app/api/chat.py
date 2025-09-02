from fastapi import APIRouter, Header, HTTPException, Request
from fastapi.responses import StreamingResponse
from utils.chat_handler import chat
from utils.api_key import is_valid_api_key
from pydantic import BaseModel

class ChatRequest(BaseModel):
    query: str

router = APIRouter()

@router.post("/chat")
def chat_ep(req : ChatRequest,api_key: str = Header(...)):
    if not is_valid_api_key(api_key):
        print(req.query)
        raise HTTPException(status_code=401, detail="Invalid API key")

    return StreamingResponse(
        chat(req.query, api_key),
        media_type="text/plain"
    )

@router.post("/is_valid_api")
def is_valid(api_key: str = Header(...)):
    if not is_valid_api_key(api_key):
        return {"message":"Incorrect API key","success": False}
    else:
        return {"message":"API key is valid","success": True}
