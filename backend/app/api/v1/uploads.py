from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.document import Document
from app.models.user import User
from app.services.cloudinary_service import upload_media

router = APIRouter(prefix="/uploads", tags=["Uploads & Documents"])


@router.post("/image")
def upload_image(
    file: UploadFile = File(...),
    folder: str = Form("images"),
    current_user: User = Depends(get_current_user)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are allowed")
    
    result = upload_media(file, folder=f"homeserve/{folder}")
    return result


@router.post("/document")
def upload_verification_document(
    doc_type: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = upload_media(file, folder="homeserve/documents")
    
    doc = Document(
        user_id=current_user.id,
        doc_type=doc_type,
        file_url=result["url"],
        public_id=result.get("public_id"),
        original_filename=result.get("original_filename"),
        is_verified=False
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    
    return {
        "id": doc.id,
        "doc_type": doc.doc_type,
        "file_url": doc.file_url,
        "is_verified": doc.is_verified,
        "created_at": doc.created_at
    }


@router.get("/documents/my")
def get_my_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    docs = db.query(Document).filter(Document.user_id == current_user.id).all()
    return docs
