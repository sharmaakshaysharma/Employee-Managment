import uvicorn
import os

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    # In production (Railway), reload should be False
    is_dev = os.getenv("DATABASE_URL", "").startswith("sqlite") or os.getenv("RAILWAY_ENVIRONMENT") is None
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=is_dev)
