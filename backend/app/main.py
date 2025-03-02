from typing import List
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from services.dynamoDB import addUser, fetchActivePatientsService, loginUser, getUserInfo, addDoctorsFromCSV, addUserEnquiryToDynamoDB, notifyDoctors
from services.main_model import getDoctorsService
import uuid

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

@app.post("/getDoctors")    
async def getDoctors(request: Request):
    data = await request.json()
    print(data)
    paitent_issue = data['paitent_issue']
    user_location = data['user_location']
    paitent_email = data['email']
    paitent_name = data['name']
    userEnquiryQuestions = data['userEnquiryQuestions']
    aiEnquiryQuestions = data['aiEnquiryQuestions']
    
    print({"paitent_issue": paitent_issue, "user_location": user_location})
    doctors = getDoctorsService(paitent_issue, user_location)
    print(doctors)
    
    uuid_value = str(uuid.uuid4())
    print(uuid_value)
    result = notifyDoctors(doctors, uuid_value, paitent_email, paitent_name, userEnquiryQuestions, aiEnquiryQuestions)
    return {"message": "Get doctors successful", "doctors": doctors, "uuid": uuid_value, "result": result}


@app.post("/addUserEnquiry")
async def addUserEnquiry(request: Request):
    data = await request.json()
    print("data from addUserEnquiry, backend", data)
    addUserEnquiryToDynamoDB(data)
    return {"message": "Add user enquiry successful"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/addAllDoctors")
async def addAllDoctors():
    result = addDoctorsFromCSV()
    return result 

@app.get("/fetchActivePatients/{doctor_email}")

async def fetchActivePatients(doctor_email: str):
    print("fetchActivePatients, backend", doctor_email)
    result = fetchActivePatientsService(doctor_email)
    return result