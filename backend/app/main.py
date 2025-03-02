from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from services.dynamoDB import addUser, loginUser, getUserInfo

app = FastAPI(
    title="My FastAPI App",
    description="A basic FastAPI backend application",
    version="1.0.0"
)

# Configure CORS
origins = [
    "http://localhost:5173",  # React dev server
    "http://localhost:3000",  # Alternative React port
    "*"  # Allow all origins (not recommended for production)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to FastAPI"}

@app.post("/login")
async def login(request: Request):
    data = await request.json()
    print(data)
    user = loginUser(data)
    if user:
        return {"message": "Login successful", "user": user}
    else:
        return {"message": "Invalid email or password"}

@app.post("/register")
async def register(request: Request):
    data = await request.json()
    print(data)
    addUser(data)
    return {"message": "Register successful"}

@app.get("/getInfo/{email}")
async def getInfo(email: str):
    user = getUserInfo(email)
    return {"message": "Get info successful", "user": user}

@app.get("/health")
async def health_check():
    return {"status": "healthy"} 