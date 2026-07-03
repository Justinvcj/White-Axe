from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.engines.validation.routes import router as validation_router
from app.engines.personalization.routes import router as personalization_router
from app.engines.adaptive.routes import router as adaptive_router
from app.engines.predictive.routes import router as predictive_router
from app.engines.revision.routes import router as revision_router

# Initialize the White-Axe FastApi Microservice
app = FastAPI(
    title="White-Axe AI Core",
    description="Python 3.11 Inference Layer running the BAM-E, CPE, AAE, and Predictive Engines",
    version="1.0.0"
)

# Configure strict CORS for frontend decoupling
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, lock to the Vercel Frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the Routers
app.include_router(
    validation_router, 
    prefix="/api/v1/validation", 
    tags=["Matrix Validation Engine (BAM-E)"]
)

app.include_router(
    personalization_router,
    prefix="/api/v1/personalization",
    tags=["Contextual Personalization Engine (CPE)"]
)

app.include_router(
    adaptive_router,
    prefix="/api/v1/adaptive",
    tags=["Adaptive Assessment Engine (AAE)"]
)

app.include_router(
    predictive_router,
    prefix="/api/v1/analytics",
    tags=["Predictive Risk Engine"]
)

app.include_router(
    revision_router,
    prefix="/api/v1/revision",
    tags=["Spaced Repetition Engine"]
)

@app.get("/health")
async def health_check():
    """
    Standard Kubernetes/Docker health check endpoint.
    """
    return {"status": "White-Axe AI Core Online"}
