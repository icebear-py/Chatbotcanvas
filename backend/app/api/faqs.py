from fastapi import APIRouter, Header, HTTPException, Form, UploadFile, File
from utils.text_extractor_files import (
    extract_text_from_pdf,
    extract_text_from_docx,
    extract_txt_from_txt,
    extract_text_from_excel
)
import json
from utils.text_extractor_url import extract_text
from utils.faqs_extractor import extract_faqs_from_text
from utils.vectordb_handler import VectorDBHandler
from utils.api_key import generate_api_key


router = APIRouter()

@router.post('/extract_faqs')
async def extract_faqs(url: str = Form(None), file: UploadFile = File(None)):
    combined_text = ""
    if url:
        extracted_url_text = extract_text(url)
        combined_text += extracted_url_text + "\n"
    if file:
        file_bytes = await file.read()
        if file.filename.endswith(".pdf"):
            text = await extract_text_from_pdf(file_bytes)
        elif file.filename.endswith(".docx"):
            text = await extract_text_from_docx(file_bytes)
        elif file.filename.endswith(".txt"):
            text = await extract_txt_from_txt(file_bytes)
        elif file.filename.endswith(".xlsx"):
            text = await extract_text_from_excel(file_bytes)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")
        combined_text += text + "\n"

    if not combined_text.strip():
        return {"message":"No valid questions found."}

    faqs = extract_faqs_from_text(combined_text)
    try:
        if len(faqs) == 0:
            raise HTTPException(status_code=400, detail="No valid questions found.")

        api_key = generate_api_key()
        db = VectorDBHandler(api_key)
        db.upsert_faqs(faqs)

        return {
            "api_key": api_key,
            "faqs": faqs,
            "faqs_stored": len(faqs),
            "message":"FAQs loaded successfully."
        }

    except Exception as e :
        raise HTTPException(status_code=500, detail=str(e))