"""
Sicura AI — FastAPI backend (dummy data for realtime frontend integration).
Full ArmorIQ + Gemini flow will replace these static responses later.
"""

from datetime import datetime, timezone
from typing import Literal

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="Sicura AI API",
    description="Scam detection platform — ArmorIQ Track 2 (NeuroX Hackathon)",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Static dummy data ───────────────────────────────────────────────────────

AUDIT_LOGS = [
    {
        "id": "log-001",
        "module": "Phishing Email",
        "status": "Blocked",
        "risk_score": 92,
        "risk_class": "risk-high",
        "content_preview": "From: paypal-security@paypa1-secure.com",
        "timestamp": "2 min ago",
    },
    {
        "id": "log-002",
        "module": "Job Offer",
        "status": "Flagged",
        "risk_score": 78,
        "risk_class": "risk-medium",
        "content_preview": "Internship at Google — pay $200 registration fee",
        "timestamp": "18 min ago",
    },
    {
        "id": "log-003",
        "module": "URL Scanner",
        "status": "Passed",
        "risk_score": 12,
        "risk_class": "risk-low",
        "content_preview": "https://github.com/mavrix-team",
        "timestamp": "1 hr ago",
    },
    {
        "id": "log-004",
        "module": "QR Code",
        "status": "Blocked",
        "risk_score": 95,
        "risk_class": "risk-danger",
        "content_preview": "QR → bit.ly/suspicious-redirect",
        "timestamp": "2 hr ago",
    },
    {
        "id": "log-005",
        "module": "Message Analyzer",
        "status": "Safe",
        "risk_score": 8,
        "risk_class": "risk-safe",
        "content_preview": "Hey, are we still meeting at 3pm?",
        "timestamp": "3 hr ago",
    },
    {
        "id": "log-006",
        "module": "URL Scanner",
        "status": "Passed",
        "risk_score": 22,
        "risk_class": "risk-low",
        "content_preview": "https://docs.armoriq.ai/platform",
        "timestamp": "5 hr ago",
    },
]

ENCRYPTION_TOOLS = [
    {
        "id": "aes-256",
        "name": "AES-256 Bound Encryption",
        "description": "Encrypts user input client-side before it reaches the analysis pipeline.",
        "status": "active",
    },
    {
        "id": "tls-transit",
        "name": "TLS 1.3 In-Transit Shield",
        "description": "All API traffic is wrapped in TLS 1.3 with certificate pinning.",
        "status": "active",
    },
    {
        "id": "key-rotation",
        "name": "Auto Key Rotation",
        "description": "Encryption keys rotate every 24 hours — zero manual intervention.",
        "status": "active",
    },
    {
        "id": "zero-storage",
        "name": "Zero-Storage Policy",
        "description": "Plaintext content is never persisted — only hashed audit metadata.",
        "status": "active",
    },
]

DUMMY_ANALYSIS = {
    "url": {
        "risk_score": 87,
        "explanation": (
            "This URL uses a look-alike domain (paypa1-secure.com instead of paypal.com) "
            "and redirects through two intermediate hops before landing on a credential-harvesting page. "
            "ArmorIQ threat intel flagged the final destination as a known phishing kit."
        ),
        "next_step": "Do not click this link. Delete the message and report it as phishing.",
        "module": "url_scanner",
        "status": "blocked",
    },
    "email": {
        "risk_score": 91,
        "explanation": (
            "The sender domain does not match the claimed organization (PayPal). "
            "The email uses urgency language ('account suspended in 24 hours') and contains "
            "a deceptive link masked as a legitimate login button."
        ),
        "next_step": "Do not reply or click any links. Forward to your IT security team.",
        "module": "phishing_email",
        "status": "blocked",
    },
    "job": {
        "risk_score": 84,
        "explanation": (
            "This job offer asks for an upfront registration fee — a classic internship scam pattern. "
            "The company name impersonates a well-known brand but the contact email uses a free provider."
        ),
        "next_step": "Do not pay any fees. Verify the offer on the company's official careers page.",
        "module": "job_scam",
        "status": "flagged",
    },
    "message": {
        "risk_score": 45,
        "explanation": (
            "The message contains vague urgency and asks you to share a verification code. "
            "While not definitively malicious, this matches common social-engineering patterns."
        ),
        "next_step": "Do not share any codes. Contact the sender through a verified channel.",
        "module": "message_analyzer",
        "status": "flagged",
    },
    "default": {
        "risk_score": 35,
        "explanation": (
            "ArmorIQ policy check passed. Content was analyzed across threat intel and AI models. "
            "No critical red flags detected, but exercise caution with unfamiliar senders."
        ),
        "next_step": "Proceed with caution. Verify the source through an official channel.",
        "module": "auto_detect",
        "status": "passed",
    },
}


def _detect_content_type(content: str) -> str:
    lowered = content.lower().strip()
    if lowered.startswith("http://") or lowered.startswith("https://") or "://" in lowered:
        return "url"
    if "@" in lowered and ("subject:" in lowered or "from:" in lowered or "dear" in lowered):
        return "email"
    if any(kw in lowered for kw in ("internship", "job offer", "hiring", "registration fee", "salary")):
        return "job"
    if len(content) < 200 and ("code" in lowered or "verify" in lowered or "urgent" in lowered):
        return "message"
    return "default"


def _risk_class(score: int) -> str:
    if score >= 80:
        return "risk-high"
    if score >= 60:
        return "risk-medium"
    if score >= 40:
        return "risk-danger"
    if score >= 20:
        return "risk-low"
    return "risk-safe"


# ─── Request / response models ───────────────────────────────────────────────


class AnalyzeRequest(BaseModel):
    content: str = Field(..., min_length=1, description="URL, email, message, or job offer text")
    module: Literal[
        "auto_detect", "email", "url", "job", "message", "document", "qr"
    ] = "auto_detect"


class AnalyzeResponse(BaseModel):
    id: str
    risk_score: int
    explanation: str
    next_step: str
    module: str
    status: str
    armoriq_status: str
    risk_class: str
    timestamp: str
    content_preview: str


class AuditLogItem(BaseModel):
    id: str
    module: str
    status: str
    risk_score: int
    risk_class: str
    content_preview: str
    timestamp: str


class EncryptionTool(BaseModel):
    id: str
    name: str
    description: str
    status: str


# ─── Routes ──────────────────────────────────────────────────────────────────


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "sicura-ai", "version": "0.1.0"}


@app.get("/api/audit-logs")
def get_audit_logs() -> dict:
    return {"logs": AUDIT_LOGS}


@app.get("/api/encryption-tools")
def get_encryption_tools() -> dict:
    return {"tools": ENCRYPTION_TOOLS}


@app.post("/api/analyze", response_model=AnalyzeResponse)
def analyze_content(body: AnalyzeRequest) -> AnalyzeResponse:
    content = body.content.strip()

    if body.module != "auto_detect":
        content_type = body.module if body.module in DUMMY_ANALYSIS else "default"
    else:
        content_type = _detect_content_type(content)

    result = DUMMY_ANALYSIS.get(content_type, DUMMY_ANALYSIS["default"])
    preview = content[:80] + ("…" if len(content) > 80 else "")
    now = datetime.now(timezone.utc).isoformat()

    return AnalyzeResponse(
        id=f"scan-{int(datetime.now(timezone.utc).timestamp())}",
        risk_score=result["risk_score"],
        explanation=result["explanation"],
        next_step=result["next_step"],
        module=result["module"],
        status=result["status"],
        armoriq_status="passed",
        risk_class=_risk_class(result["risk_score"]),
        timestamp=now,
        content_preview=preview,
    )
