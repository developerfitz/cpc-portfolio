import boto3
from aws_xray_sdk.core import xray_recorder
from aws_xray_sdk.core import patch_all

import json
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)
patch_all()

s3 = boto3.client('s3')
BUCKET = 'cpc-portfolios'


def main(event, context):
    headers = event['headers']
    filename = headers['x-filename']
    content_type = headers['content-type']
    size = headers['x-size']
    size_in_kb = int(size) // 1000
    
    logger.info(BUCKET)
    logger.info(filename)
    logger.info(f'{size_in_kb}KB')
    # logger.info(event['headers'])

    body_message = f'''
    Hello Examiner!
    You have uploaded {filename} which is {size_in_kb}KB in size. 
    Please wait for it to process.
    A download will becoming shortly.'''
    key = f'pre-processed/{filename}'
    s3_params = {
        'Bucket': BUCKET,
        'Key': key,
        'ContentType': content_type,
    }

    url = s3.generate_presigned_url(
        'put_object',
        Params=s3_params,
        HttpMethod="PUT",
        ExpiresIn=60
     )
  
    payload = {
        'presignedUrl': url,
        'message': body_message,
        'key': key,
        'contentType': content_type,
    }

    
    return {
        'headers': {
            'Access-Control-Allow-Origin': 'http://localhost:8888',
        },
        'statusCode': 200,
        'body': json.dumps(payload),
    }

    