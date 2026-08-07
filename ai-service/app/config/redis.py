from dotenv import load_dotenv
from redis.asyncio import Redis
from os import getenv
load_dotenv()

REDIS_URL = getenv("REDIS_URL")

redis = Redis(
    host = "localhost",
    port = 6379
)

pubsub = redis.pubsub()


