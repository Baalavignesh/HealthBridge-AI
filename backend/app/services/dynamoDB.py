import datetime
import os
import boto3
from boto3.dynamodb.types import TypeDeserializer

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

    