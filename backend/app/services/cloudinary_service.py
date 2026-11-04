import os
import uuid
import cloudinary
import cloudinary.uploader
from fastapi import UploadFile, HTTPException
from app.core.config import settings

# Initialize cloudinary if configured
is_cloudinary_configured = bool(
    settings.CLOUDINARY_CLOUD_NAME and
    settings.CLOUDINARY_API_KEY and
    settings.CLOUDINARY_API_SECRET
)

if is_cloudinary_configured:
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
        secure=True
    )


def upload_media(file: UploadFile, folder: str = "homeserve") -> dict:
    """
    Upload file to Cloudinary if credentials are provided,
    otherwise store in local static directory for development.
    """
    try:
        content = file.file.read()
        
        if is_cloudinary_configured:
            result = cloudinary.uploader.upload(
                content,
                folder=folder,
                resource_type="auto"
            )
            return {
                "url": result.get("secure_url") or result.get("url"),
                "public_id": result.get("public_id"),
                "format": result.get("format"),
                "original_filename": file.filename
            }
        else:
            # Local fallback for development / offline testing
            static_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "static", "uploads", folder)
            os.makedirs(static_dir, exist_ok=True)
            
            ext = os.path.splitext(file.filename)[1] or ".jpg"
            unique_name = f"{uuid.uuid4().hex}{ext}"
            file_path = os.path.join(static_dir, unique_name)
            
            with open(file_path, "wb") as f:
                f.write(content)
                
            return {
                "url": f"/static/uploads/{folder}/{unique_name}",
                "public_id": unique_name,
                "format": ext.replace(".", ""),
                "original_filename": file.filename
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")
