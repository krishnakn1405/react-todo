import json
import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key
from datetime import datetime
import secrets

# Initialize the DynamoDB client
dynamodb = boto3.resource('dynamodb', region_name='ap-south-1')
dynamodb_table = dynamodb.Table('todos')


def lambda_handler(event, context):
    claims = event.get("requestContext", {}).get(
        "authorizer", {}).get("claims", {})

    if not claims:

        body = {
            'Operation': 'NONE',
            'Message': 'FAILURE',
            'Item': 'unauthorized'
        }
        return build_response(401, body)

    username = claims.get("username")
    if not username:
        body = {
            'Operation': 'NONE',
            'Message': 'FAILURE',
            'Item': 'No user found'
        }
        return build_response(400, body)

    response = None

    try:
        http_method = event.get('httpMethod')

        if http_method == 'GET':
            query_params = event.get("queryStringParameters", {}) or {}
            todo_id = query_params.get("id", "none")
            response = get_todos(todo_id, username)
        elif http_method == 'POST':
            response = save_todos(json.loads(event['body']), username)
        elif http_method == 'PUT':
            response = update_todos(json.loads(event['body']), username)
        elif http_method == 'DELETE':
            query_params = event.get("queryStringParameters", {}) or {}
            todo_id = query_params.get("id", "none")
            response = delete_todos(todo_id, username)
        else:
            body = {
                'Operation': 'NONE',
                'Message': 'FAILURE',
                'Item': 'Invalid request'
            }
            response = build_response(404, body)

    except Exception as e:
        body = {
            'Operation': 'NONE',
            'Message': 'FAILURE',
            'Item': 'Some error occured'
        }
        return build_response(400, body)

    return response


def get_todos(id, username):
    try:
        if id == "none":
            response = dynamodb_table.scan(
                FilterExpression="username = :u",
                ExpressionAttributeValues={":u": username}
            )

            item = response.get('Items', [])
            body = {
                'Operation': 'GET',
                'Message': 'SUCCESS',
                'Item': item
            }
            return build_response(200, body)
        else:
            response = dynamodb_table.get_item(Key={"id": id})
            item = response.get("Item", {})
            body = {
                'Operation': 'GET',
                'Message': 'SUCCESS',
                'Item': item
            }
            return build_response(200, body)
    except ClientError as e:
        body = {
            'Operation': 'GET',
            'Message': 'FAILURE',
            'Item': 'Some error occured'
        }
        return build_response(400, body)


def save_todos(request_body, username):
    try:
        request_body["username"] = username
        now = datetime.now()
        date_time = now.strftime("%d%m%Y%H%M%S")
        new_id = secrets.token_hex(4)
        response = dynamodb_table.get_item(Key={"id": new_id})
        request_body["date_time"] = date_time

        if "Item" not in response:
            request_body["id"] = new_id

        dynamodb_table.put_item(Item=request_body)

        body = {
            'Operation': 'POST',
            'Message': 'SUCCESS',
            'Item': request_body
        }

        return build_response(200, body)

    except ClientError as e:
        body = {
            'Operation': 'POST',
            'Message': 'FAILURE',
            'Item': 'Some error occured'
        }
        return build_response(400, body)


def update_todos(request_body, username):
    try:
        id = request_body['id']
        now = datetime.now()
        date_time = now.strftime("%d%m%Y%H%M%S")

        response = dynamodb_table.update_item(
            Key={'id': id},
            UpdateExpression="SET #nm = :name, #dt = :datetime",
            ExpressionAttributeNames={
                "#nm": "name",
                "#dt": "date_time"
            },
            ExpressionAttributeValues={
                ':name': request_body['name'], ':datetime': date_time},
            ReturnValues='UPDATED_NEW'
        )

        body = {
            'Operation': 'PUT',
            'Message': 'SUCCESS',
            'Item': date_time
        }
        return build_response(200, body)

    except ClientError as e:
        body = {
            'Operation': 'PUT',
            'Message': 'FAILURE',
            'Item': 'Some error occured'
        }
        return build_response(400, body)


def delete_todos(id, username):
    if id == "none":
        return build_response(400, 'No todos deleted')
    else:
        try:
            response = dynamodb_table.delete_item(
                Key={'id': id},
                ReturnValues='ALL_OLD'
            )

            body = {
                'Operation': 'DELETE',
                'Message': 'SUCCESS',
                'Item': 'Todo deleted'
            }
            return build_response(200, body)

        except ClientError as e:
            body = {
                'Operation': 'DELETE',
                'Message': 'FAILURE',
                'Item': 'Some error occured'
            }
            return build_response(400, body)


def build_response(status_code, body):
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",  # Allow all domains
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        },
        'body': json.dumps(body)
    }
