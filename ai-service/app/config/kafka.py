from aiokafka import AIOKafkaProducer
import os
import ssl

producer:AIOKafkaProducer = None

async def get_producer()->AIOKafkaProducer:
    global producer

    if producer is None:
        ssl_context = ssl.create_default_context()
    
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE

        producer = AIOKafkaProducer(
            # bootstrap_servers = 'localhost:9092'
            bootstrap_servers = f"{os.environ.get('KAFKA_HOST')}:{os.environ.get('KAFKA_PORT')}",
            client_id = os.environ.get('KAFKA_CLIENT_ID'),
            
            security_protocol = 'SASL_SSL',
            sasl_mechanism = 'SCRAM-SHA-256',
            sasl_plain_username = os.environ.get('KAFKA_USERNAME'),
            sasl_plain_password = os.environ.get('KAFKA_PASSWORD'),
            
            ssl_context = ssl_context
        )
        await producer.start()
        
    return producer