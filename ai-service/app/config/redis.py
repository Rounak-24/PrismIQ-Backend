from dotenv import load_dotenv
from redis import Redis
from os import getenv
load_dotenv()

redis = Redis(
    host = "localhost",
    port = 6379
)

pubsub = redis.pubsub()


