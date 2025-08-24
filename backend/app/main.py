from fastapi import FastAPI
from app.api import chat
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="Chatbot API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api" ,tags=["Chat"])

@app.get("/")
async def root():
    return {"message": "API is live master."}
