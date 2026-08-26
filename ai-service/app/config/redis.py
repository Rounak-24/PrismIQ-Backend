from dotenv import load_dotenv
from redis.asyncio import Redis
from os import getenv
load_dotenv()

REDIS_URL = getenv("REDIS_URL")

redis = Redis.from_url(
    url = REDIS_URL,
    decode_responses = True
)

pubsub = redis.pubsub()

# redis = Redis(
#     host = "localhost",
#     port = 6379,
#     decode_responses = True
# )