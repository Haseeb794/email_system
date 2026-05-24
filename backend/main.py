from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
import aiosmtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os
from database import get_db, engine
import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Email Confirmation System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# SMTP config — points to Mailpit
SMTP_HOST = os.getenv("SMTP_HOST", "localhost")
SMTP_PORT = int(os.getenv("SMTP_PORT", "1025"))
FROM_EMAIL = os.getenv("FROM_EMAIL", "noreply@emailsystem.dev")


class SubscriberCreate(BaseModel):
    name: str
    email: EmailStr


class SubscriberResponse(BaseModel):
    id: int
    name: str
    email: str
    confirmed: bool

    class Config:
        from_attributes = True


async def send_confirmation_email(name: str, email: str):
    html_body = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <style>
    body {{ font-family: 'Georgia', serif; background: #f5f0eb; margin: 0; padding: 0; }}
    .wrapper {{ max-width: 600px; margin: 40px auto; background: #fff; border-radius: 4px; overflow: hidden; box-shadow: 0 2px 20px rgba(0,0,0,0.08); }}
    .header {{ background: #1a1a2e; padding: 48px 40px; text-align: center; }}
    .header h1 {{ color: #e8c97e; font-size: 28px; margin: 0; letter-spacing: 2px; font-weight: normal; text-transform: uppercase; }}
    .header p {{ color: #9999bb; font-size: 13px; margin: 8px 0 0; letter-spacing: 1px; }}
    .body {{ padding: 40px; color: #333; line-height: 1.8; }}
    .greeting {{ font-size: 22px; color: #1a1a2e; margin-bottom: 16px; }}
    .email-highlight {{ display: inline-block; background: #f5f0eb; border-left: 3px solid #e8c97e; padding: 10px 20px; font-family: 'Courier New', monospace; font-size: 14px; color: #1a1a2e; margin: 16px 0; border-radius: 0 4px 4px 0; }}
    .message {{ font-size: 15px; color: #555; }}
    .footer {{ background: #f5f0eb; padding: 24px 40px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #e8e0d5; }}
    .divider {{ height: 1px; background: linear-gradient(to right, transparent, #e8c97e, transparent); margin: 24px 0; }}
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>✉ Confirmed</h1>
      <p>Email Registration System</p>
    </div>
    <div class="body">
      <div class="greeting">Hello, {name} 👋</div>
      <p class="message">
        Your email address has been successfully registered with our system.
        We've recorded the following address on your behalf:
      </p>
      <div class="email-highlight">📧 {email}</div>
      <div class="divider"></div>
      <p class="message">
        If you did not request this registration, you can safely ignore this email.

      </p>
    </div>
    <div class="footer">
      This confirmation was sent to <strong>{email}</strong> · Do not reply to this message
    </div>
  </div>
</body>
</html>
"""

    message = MIMEMultipart("alternative")
    message["From"] = FROM_EMAIL
    message["To"] = email
    message["Subject"] = f"✓ Registration Confirmed — Welcome, {name}!"

    plain = f"Hello {name},\n\nYour email ({email}) has been registered successfully.\n\nWelcome,\nThe Email System Team"
    message.attach(MIMEText(plain, "plain"))
    message.attach(MIMEText(html_body, "html"))

    await aiosmtplib.send(
        message,
        hostname=SMTP_HOST,
        port=SMTP_PORT,
        use_tls=False,
    )


@app.post("/api/subscribers", response_model=SubscriberResponse, status_code=201)
async def create_subscriber(payload: SubscriberCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Subscriber).filter(
        models.Subscriber.email == payload.email
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    subscriber = models.Subscriber(name=payload.name, email=payload.email)
    db.add(subscriber)
    db.commit()
    db.refresh(subscriber)

    try:
        await send_confirmation_email(payload.name, payload.email)
        subscriber.confirmed = True
        db.commit()
        db.refresh(subscriber)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Saved but email failed: {str(e)}")

    return subscriber


@app.get("/api/subscribers", response_model=list[SubscriberResponse])
def list_subscribers(db: Session = Depends(get_db)):
    return db.query(models.Subscriber).order_by(models.Subscriber.id.desc()).all()


@app.delete("/api/subscribers/{subscriber_id}", status_code=204)
def delete_subscriber(subscriber_id: int, db: Session = Depends(get_db)):
    sub = db.query(models.Subscriber).filter(models.Subscriber.id == subscriber_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subscriber not found")
    db.delete(sub)
    db.commit()


@app.get("/health")
def health():
    return {"status": "ok"}