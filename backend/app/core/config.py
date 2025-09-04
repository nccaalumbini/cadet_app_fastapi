import os
from pydantic import BaseModel
from dotenv import load_dotenv

# Load .env file if present
load_dotenv()

class Settings(BaseModel):
    DB_URL: str = os.getenv(
        "DB_URL",
        "mysql+pymysql://nccaa_user:nccaa_pass@127.0.0.1:3307/nccaa_db"
    )
    JWT_SECRET: str = os.getenv("JWT_SECRET", "CHANGE_ME_IN_PROD")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

# Create settings instance
settings = Settings()