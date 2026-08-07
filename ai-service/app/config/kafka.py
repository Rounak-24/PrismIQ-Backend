from aiokafka import AIOKafkaProducer

producer:AIOKafkaProducer = None

async def get_producer()->AIOKafkaProducer:
    global producer

    if producer is None:
        producer = AIOKafkaProducer(
            bootstrap_servers = 'localhost:9092'
        )
        await producer.start()
        
    return producer