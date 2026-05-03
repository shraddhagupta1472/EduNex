import sys
from pathlib import Path
from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware


# Add parent directory to path for absolute imports
parent_dir = Path(__file__).parent.parent
if str(parent_dir) not in sys.path:
    sys.path.insert(0, str(parent_dir))

from Backend.routes.test import router as test_router
from Backend.routes.analysis_routes import router as analysis_router
from Backend.routes.plan import router as plan_router
from Backend.routes.retest import router as retest_router
from Backend.routes.chat import router as chat_router
from Backend.data.questions import questions

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=400,
        content={"error": "Invalid input"}
    )

@app.get("/")
def read_root():
    return {"message": "EDUNEX Backend Running"}

app.include_router(test_router)
app.include_router(analysis_router)
app.include_router(plan_router)
app.include_router(retest_router)
app.include_router(chat_router)