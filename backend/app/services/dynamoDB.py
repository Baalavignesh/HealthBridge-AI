import datetime
import os
import boto3
from boto3.dynamodb.types import TypeDeserializer
import pandas as pd

client = boto3.client(
    'dynamodb',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_REGION')
)

def MyTypeDeserializer(item):
    deserializer = TypeDeserializer()
    return {k: deserializer.deserialize(v) for k, v in item.items()}

def addUser(user_info):
    print(user_info)
    if user_info['user_type'] == 'Patient':
        response = client.put_item(     
            TableName='anyhealth-userinfo',
            Item={
            'user_name': {'S': user_info['fullName']},
            'email': {'S': user_info['email']},
            'password': {'S': user_info['password']},
            'type': {'S': user_info['user_type']},
            'age': {'N': str(user_info['age'])},
            'gender': {'S': user_info['gender']},
            'mobile': {'S': user_info['mobile']},
            'address': {'S': user_info['address']},
            }
        )
    else:
        response = client.put_item(     
            TableName='anyhealth-userinfo',
            Item={
            'user_name': {'S': user_info['fullName']},
            'email': {'S': user_info['email']},
            'password': {'S': user_info['password']},
            'type': {'S': user_info['user_type']},
            'mobile': {'S': user_info['mobile']},
            'hospital': {'S': user_info['hospital']},
            'hospitalLocation': {'S': user_info['hospitalLocation']},
            'specialization': {'S': user_info['specialization']},
            }
        )   
    return response;

def loginUser(data):
    try:
        response = client.scan(
            TableName='anyhealth-userinfo',
            FilterExpression='email = :email AND password = :password',
            ExpressionAttributeValues={
                ':email': {'S': data['email']},
                ':password': {'S': data['password']}
            }
        )
        
        if response['Items']:        
            return MyTypeDeserializer(response['Items'][0]) # Return the first matching user as a normal JSON response
        else:
            return None
    except Exception as e:
        print("Error during login:", e)
        return None


def getUserInfo(email):
    # Assuming 'user_id' is the primary key instead of 'email'
    response = client.scan(
        TableName='anyhealth-userinfo',
        FilterExpression='email = :email',
        ExpressionAttributeValues={
            ':email': {'S': email}
        }
    )
    if response['Items']:
        return MyTypeDeserializer(response['Items'][0])
    return None

    

def addDoctorsFromCSV():
    try:
        # Read the CSV file
        df = pd.read_csv("datasets/doctors.csv")
        
        # Iterate through each row and add to DynamoDB
        for _, row in df.iterrows():
            print(row)
            response = client.put_item(
                TableName='anyhealth-userinfo',
                Item={
                    'user_name': {'S': row['doctor_name']},
                    'email': {'S': row['email']},
                    'mobile': {'S': row['phone_number']},
                    'hospital': {'S': row['hospital_name']},
                    'hospitalLocation': {'S': row['hospital_state']},
                    'specialization': {'S': row['medical_specialty']},
                    'password': {'S': row['password']},
                    'type': {'S': 'Doctor'}
                }
            )
            print(f"Added doctor: {row['doctor_name']}")
            
            
        return {"message": "Successfully added all doctors"}
    except Exception as e:
        print(f"Error adding doctors: {e}")
        return {"message": "Error adding doctors", "error": str(e)}

def addUserEnquiryToDynamoDB(data):
    print("data from Service, DynamoDB", data)
    try:
        # Handle user enquiry questions
        user_enquiry_map = {}
        for idx, (key, value) in enumerate(data['userEnquiryQuestions'].items()):
            user_enquiry_map[str(idx)] = {'S': value}

        # Handle AI enquiry questions - take only the first item of the tuple
        ai_enquiry_map = {}
        for idx, (key, value) in enumerate(data['aiEnquiryQuestions'].items()):
            # If value is a tuple, take the first item (Tamil text)
            if isinstance(value, tuple):
                ai_enquiry_map[str(idx)] = {'S': value[0]}
            else:
                ai_enquiry_map[str(idx)] = {'S': value}

        response = client.put_item(
            TableName='apointment_info',
            Item={
                'paitent_name': {'S': data['userInfo']['user_name']},
                'paitent': {'S': data['userInfo']['email']},
                'uuid': {'S': data['uuid']},
                'user_enquiry_questions': {'M': user_enquiry_map},
                'ai_enquiry_questions': {'M': ai_enquiry_map},
            }
        )
        print("Successfully added user enquiry")
        return response
    except Exception as e:
        print("Error adding user enquiry:", str(e))
        raise e


def notifyDoctors(doctors, uuid, paitent_mail, paitent_name, userEnquiryQuestions, aiEnquiryQuestions):
    print('notifyDoctors, DynamoDB', uuid, paitent_mail, paitent_name)
    
    user_enquiry_map = {}
    for idx, (key, value) in enumerate(userEnquiryQuestions.items()):
        user_enquiry_map[str(idx)] = {'S': value}

    ai_enquiry_map = {}
    for idx, (key, value) in enumerate(aiEnquiryQuestions.items()):
        ai_enquiry_map[str(idx)] = {'S': value} 
    
    try:
        print("trying to notify doctors")
        responses = []
        for doctor in doctors:
            print("doctor 1")
            response = client.put_item(
                TableName='apointment-info',
                Item={
                    'doctor_name': {'S': doctor['doctor_name']},
                    'doctor': {'S': doctor['email']},
                    'uuid': {'S': uuid},
                    'paitent_name': {'S': paitent_name},
                    'paitent': {'S': paitent_mail},
                    'user_enquiry_questions': {'M': user_enquiry_map},
                    'ai_enquiry_questions': {'M': ai_enquiry_map},
                }
            )
            responses.append(response)
        return {"message": "Successfully notified doctors", "responses": responses}
    except Exception as e:
        print("Error notifying doctors:", str(e))
        return {"message": "Error notifying doctors", "error": str(e)}
    
def fetchActivePatientsService(doctor_email):
    print("fetchActivePatientsService, DynamoDB", doctor_email)
    response = client.scan(
        TableName='apointment-info',
        FilterExpression='doctor = :doctor',
        ExpressionAttributeValues={':doctor': {'S': doctor_email}}
    )
        
    if response['Items']:
        print("response['Items']", response['Items'])
        # Convert each item in the list
        patients_data = []
        deserialized_items = []
        for item in response['Items']:
            deserialized_item = MyTypeDeserializer(item)
            # Also deserialize the nested maps
            if 'user_enquiry_questions' in deserialized_item:
                deserialized_item['user_enquiry_questions'] = [v for v in deserialized_item['user_enquiry_questions'].values()]
            if 'ai_enquiry_questions' in deserialized_item:
                deserialized_item['ai_enquiry_questions'] = [v for v in deserialized_item['ai_enquiry_questions'].values()]
            
            deserialized_items.append(deserialized_item)
            patient_info = getUserInfo(deserialized_item['paitent'])
            print('further info', patient_info)
            if patient_info:
                patients_data.append(patient_info)
        return [deserialized_items, patients_data]
    else:
        return {"message": "No active patients found"}
