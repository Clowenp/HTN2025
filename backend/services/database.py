import boto3
from botocore.exceptions import ClientError
from typing import List, Dict, Any, Optional
import uuid
from datetime import datetime

class DatabaseService:
    """Service for managing DynamoDB operations"""
    
    def __init__(self, region_name: str = 'us-east-1', table_name: str = 'photo_labels'):
        self.region_name = region_name
        self.table_name = table_name
        self.dynamodb = None
        self.table = None
        
        try:
            self.dynamodb = boto3.resource('dynamodb', region_name=region_name)
            self.table = self.dynamodb.Table(table_name)
        except Exception as e:
            print(f"Warning: Could not connect to DynamoDB: {e}")
    
    def create_table_if_not_exists(self):
        """Create the photo_labels table if it doesn't exist"""
        if not self.dynamodb:
            return False
            
        try:
            # Check if table exists
            self.table.load()
            print(f"Table {self.table_name} already exists")
            return True
            
        except ClientError as e:
            if e.response['Error']['Code'] == 'ResourceNotFoundException':
                # Create table
                table = self.dynamodb.create_table(
                    TableName=self.table_name,
                    KeySchema=[
                        {
                            'AttributeName': 'label_id',
                            'KeyType': 'HASH'
                        }
                    ],
                    AttributeDefinitions=[
                        {
                            'AttributeName': 'label_id',
                            'AttributeType': 'S'
                        },
                        {
                            'AttributeName': 'image_id',
                            'AttributeType': 'S'
                        }
                    ],
                    GlobalSecondaryIndexes=[
                        {
                            'IndexName': 'ImageIdIndex',
                            'KeySchema': [
                                {
                                    'AttributeName': 'image_id',
                                    'KeyType': 'HASH'
                                }
                            ],
                            'Projection': {
                                'ProjectionType': 'ALL'
                            },
                            'BillingMode': 'PAY_PER_REQUEST'
                        }
                    ],
                    BillingMode='PAY_PER_REQUEST'
                )
                
                # Wait for table to be created
                table.wait_until_exists()
                print(f"Table {self.table_name} created successfully")
                return True
            else:
                print(f"Error creating table: {e}")
                return False
    
    def store_image_labels(self, image_id: str, labels: List[str], 
                          filename: str = None, metadata: Dict = None) -> bool:
        """Store labels for an image in DynamoDB"""
        if not self.table:
            print("Warning: DynamoDB not configured, skipping label storage")
            return False
            
        try:
            # Store each label as a separate item with the same image_id
            for label in labels:
                label_id = str(uuid.uuid4())
                item = {
                    'label_id': label_id,
                    'image_id': image_id,
                    'label': label.lower().strip(),
                    'created_at': datetime.utcnow().isoformat(),
                }
                
                if filename:
                    item['filename'] = filename
                if metadata:
                    item['metadata'] = metadata
                    
                self.table.put_item(Item=item)
            
            return True
            
        except ClientError as e:
            print(f"Error storing labels: {e}")
            return False
    
    def get_images_by_labels(self, labels: List[str]) -> List[Dict[str, Any]]:
        """Get image IDs that match any of the provided labels"""
        if not self.table:
            return []
            
        try:
            image_ids = set()
            
            # Query for each label
            for label in labels:
                response = self.table.scan(
                    FilterExpression='#label = :label',
                    ExpressionAttributeNames={'#label': 'label'},
                    ExpressionAttributeValues={':label': label.lower().strip()}
                )
                
                for item in response['Items']:
                    image_ids.add(item['image_id'])
            
            # Get unique image information
            images = []
            for image_id in image_ids:
                image_info = self.get_image_info(image_id)
                if image_info:
                    images.append(image_info)
            
            return images
            
        except ClientError as e:
            print(f"Error querying labels: {e}")
            return []
    
    def get_image_info(self, image_id: str) -> Optional[Dict[str, Any]]:
        """Get comprehensive information about an image"""
        if not self.table:
            return None
            
        try:
            # Query all labels for this image
            response = self.table.query(
                IndexName='ImageIdIndex',
                KeyConditionExpression='image_id = :image_id',
                ExpressionAttributeValues={':image_id': image_id}
            )
            
            if not response['Items']:
                return None
            
            # Aggregate image information
            labels = []
            filename = None
            created_at = None
            metadata = {}
            
            for item in response['Items']:
                labels.append(item['label'])
                if 'filename' in item and not filename:
                    filename = item['filename']
                if 'created_at' in item and not created_at:
                    created_at = item['created_at']
                if 'metadata' in item:
                    metadata.update(item.get('metadata', {}))
            
            return {
                'image_id': image_id,
                'labels': labels,
                'filename': filename,
                'created_at': created_at,
                'metadata': metadata
            }
            
        except ClientError as e:
            print(f"Error getting image info: {e}")
            return None
    
    def get_all_images(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Get all images in the database"""
        if not self.table:
            return []
            
        try:
            # Get all unique image IDs
            response = self.table.scan(
                ProjectionExpression='image_id',
                Limit=limit * 10  # Get more items to account for duplicates
            )
            
            image_ids = set()
            for item in response['Items']:
                image_ids.add(item['image_id'])
            
            # Get information for each unique image
            images = []
            for image_id in list(image_ids)[:limit]:
                image_info = self.get_image_info(image_id)
                if image_info:
                    images.append(image_info)
            
            return images
            
        except ClientError as e:
            print(f"Error getting all images: {e}")
            return []
    
    def delete_image(self, image_id: str) -> bool:
        """Delete all labels associated with an image"""
        if not self.table:
            return False
            
        try:
            # Get all label items for this image
            response = self.table.query(
                IndexName='ImageIdIndex',
                KeyConditionExpression='image_id = :image_id',
                ExpressionAttributeValues={':image_id': image_id}
            )
            
            # Delete each label item
            for item in response['Items']:
                self.table.delete_item(
                    Key={'label_id': item['label_id']}
                )
            
            return True
            
        except ClientError as e:
            print(f"Error deleting image: {e}")
            return False
