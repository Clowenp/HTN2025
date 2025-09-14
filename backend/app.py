from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import uuid
from datetime import datetime
import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key
import anthropic
import base64
import io
from PIL import Image
from decimal import Decimal
import time
from dotenv import load_dotenv
import json

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Configuration
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Constants
S3_BUCKET = os.getenv('S3_BUCKET')
REGION = os.getenv('AWS_REGION')
USER_ID = os.getenv('TEST_USER_ID')
ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY')

# Initialize AWS DynamoDB client (will need AWS credentials configured)
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
images_table = dynamodb.Table('images')
tags_table = dynamodb.Table('tags')
users_table = dynamodb.Table('users')
s3 = boto3.client("s3", region_name='us-east-1')

# Image recognition
rekognition = boto3.client('rekognition')
# labels_table = dynamodb.Table('photo_labels')

# Initialize Anthropic client (will need API key)
# anthropic_client = anthropic.Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))

def get_all_images():
    response = images_table.scan()
    items = response.get('Items', [])
    for item in items:
        if "tags" in item:
            for tag in item["tags"]:
                if "confidence" in tag:
                    tag["confidence"] = float(tag["confidence"])
    items.sort(key=lambda x: float(x.get("dateModified", 0)), reverse=True)
    return jsonify(items)

@app.route('/', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'PhotoMind Backend',
        'version': '1.0.0'
    })

@app.route('/api/upload', methods=['POST'])
def upload_image():
    """
    Upload an image and process it through Omniparser and Claude for labeling
    """
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Generate unique image ID
        image_id = str(uuid.uuid4())
        
        # Save the uploaded file
        filename = f"{image_id}_{file.filename}"
        s3.upload_fileobj(
            file,
            S3_BUCKET,
            filename,
            ExtraArgs={"ContentType": file.content_type}
        )
        file_url = f"https://{S3_BUCKET}.s3.{REGION}.amazonaws.com/{filename}"

        # Run Rekognition: generate tags
        response = rekognition.detect_labels(
            Image={"S3Object": {"Bucket": S3_BUCKET, "Name": filename}},
            MaxLabels=10,
            MinConfidence=75
        )

        # Store tag and confidence info
        tags = [{'name': label['Name'], 'confidence': Decimal(str(label['Confidence']))} for label in response['Labels']]

        new_item = {
            "id": image_id,
            "s3Url": file_url,
            "tags": tags,
            "userId": USER_ID,
            "dateModified": str(time.time()),
            "filename": file.filename,
        }

        images_table.put_item(
            Item=new_item
        )
        
        return jsonify(new_item)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/search', methods=['GET'])
def search_images():
    """
    Search images based on natural language query
    """
    try:
        return get_all_images()

        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/deepsearch', methods=['get'])
def deep_search_api():
    query = request.args.get("query")
    try:
        response = tags_table.scan()
        print("=======")
        print("tags: ", response)
        print("=======")
        all_tags = set()
        
        for item in response.get('Items', []):
            all_tags.add(item['name'])
        
        tags_string = ','.join(sorted(all_tags))
        
        prompt = f"""Please analyze the user query:
"{query}" 
and select the top 3 most relevant tags from this list: [{tags_string}]
Return ONLY a JSON array (no outer object) with the top matches in order of confidence. Use this exact format:

[
{{"tag": "tag_name", "confidence": 95}},
{{"tag": "tag_name", "confidence": 87}},
{{"tag": "tag_name", "confidence": 72}}
]

Rules:
- Return maximum 3 tags, fewer if less than 3 are relevant
- Confidence values: 0-100 (integers only)
- Order by confidence (highest first)
- Return empty array [] if no tags match"""

        print("=======")
        print("Prompt: ", prompt)
        print("=======")
        max_retries = 2
        for attempt in range(max_retries):
            try:
                client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
                response = client.messages.create(
                    model="claude-3-haiku-20240307",
                    max_tokens=512,
                    messages=[{"role": "user", "content": prompt}]
                )

                print(response)
                
                llm_response = response.content[0].text.strip()
                
                print("=======")
                print("LLM Response: ", llm_response)
                print("=======")
                
                
                return jsonify({
                    'success': True,
                    'results': llm_response
                })
                
            except json.JSONDecodeError as json_err:
                if attempt == max_retries - 1:  # Last attempt failed
                    return jsonify({
                        'success': False,
                        'error': 'Query is not working, please try a different query',
                        'category': category
                    }), 400
                # Continue to next attempt
                continue
                
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/image/<image_id>', methods=['GET'])
def get_image_details(image_id):
    """
    Get detailed information about a specific image
    """
    try:
        # TODO: Query DynamoDB for image labels and metadata
        # TODO: Use Claude to generate detailed description of the image
        
        # For now, return mock response
        mock_details = {
            'image_id': image_id,
            'filename': f'{image_id}_sample.jpg',
            'labels': ['nature', 'outdoor', 'landscape', 'mountain', 'sky'],
            'detailed_description': 'A beautiful landscape photograph showing mountains in the background with a clear blue sky. The image captures the natural beauty of the outdoors with excellent lighting and composition.',
            'upload_date': datetime.now().isoformat(),
            'file_size': '2.5MB',
            'dimensions': '1920x1080'
        }
        
        return jsonify({
            'success': True,
            'image_details': mock_details
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/gallery', methods=['GET'])
def get_gallery():
    """
    Get all images in the gallery
    """
    try:
        # TODO: Query DynamoDB for all images
        # TODO: Return paginated results
        
        # For now, return mock gallery
        mock_gallery = [
            {
                'image_id': 'gallery-1',
                'filename': 'nature1.jpg',
                'labels': ['nature', 'forest', 'green'],
                'thumbnail_url': '/api/thumbnail/gallery-1',
                'upload_date': datetime.now().isoformat()
            },
            {
                'image_id': 'gallery-2',
                'filename': 'city1.jpg', 
                'labels': ['city', 'urban', 'night'],
                'thumbnail_url': '/api/thumbnail/gallery-2',
                'upload_date': datetime.now().isoformat()
            },
            {
                'image_id': 'gallery-3',
                'filename': 'portrait1.jpg',
                'labels': ['person', 'portrait', 'indoor'],
                'thumbnail_url': '/api/thumbnail/gallery-3',
                'upload_date': datetime.now().isoformat()
            }
        ]
        
        return jsonify({
            'success': True,
            'images': mock_gallery,
            'total_count': len(mock_gallery)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/thumbnail/<image_id>', methods=['GET'])
def get_thumbnail(image_id):
    """
    Get thumbnail for a specific image
    """
    try:
        # TODO: Generate or retrieve thumbnail from storage
        # For now, return placeholder response
        return jsonify({
            'success': True,
            'thumbnail_url': f'/uploads/thumbnails/{image_id}_thumb.jpg'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/category/<category>', methods=['GET'])
def category(category):
    try:
        response = tags_table.scan()
        print("=======")
        print("tags: ", response)
        print("=======")
        all_tags = set()
        
        for item in response.get('Items', []):
            all_tags.add(item['name'])
        
        tags_string = ','.join(sorted(all_tags))
        
        prompt = f"""Please analyze the category "{category}" and select the top 3 most relevant tags from this list: [{tags_string}]
Return ONLY a JSON array (no outer object) with the top matches in order of confidence. Use this exact format:

[
{{"tag": "tag_name", "confidence": 95}},
{{"tag": "tag_name", "confidence": 87}},
{{"tag": "tag_name", "confidence": 72}}
]

Rules:
- Return maximum 3 tags, fewer if less than 3 are relevant
- Confidence values: 0-100 (integers only)
- Order by confidence (highest first)
- Return empty array [] if no tags match"""

        print("=======")
        print("Prompt: ", prompt)
        print("=======")
        max_retries = 2
        for attempt in range(max_retries):
            try:
                client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
                response = client.messages.create(
                    model="claude-3-haiku-20240307",
                    max_tokens=512,
                    messages=[{"role": "user", "content": prompt}]
                )

                print(response)
                
                llm_response = response.content[0].text.strip()
                
                print("=======")
                print("LLM Response: ", llm_response)
                print("=======")
                
                parsed_results = json.loads(llm_response)
                
                return jsonify({
                    'success': True,
                    'category': category,
                    'results': parsed_results
                })
                
            except json.JSONDecodeError as json_err:
                if attempt == max_retries - 1:  # Last attempt failed
                    return jsonify({
                        'success': False,
                        'error': 'Query is not working, please try a different query',
                        'category': category
                    }), 400
                # Continue to next attempt
                continue
                
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/api/llm/<query>', methods=['GET'])
def llm(query):
    try:
        # Send tags to Claude
        client = anthropic.Anthropic(
            api_key=os.getenv("ANTHROPIC_API_KEY")
        )
        response = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=1024,
            messages=[
                {"role": "user", "content": f"{query}"}
            ]
        )

        print(response)
        print(response.content[0].text)

        return jsonify({
            'success': True,
            'query': query,
            'results': response.content[0].text
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
