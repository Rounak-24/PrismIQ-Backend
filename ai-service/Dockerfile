# Use an official lightweight Python base image
FROM python:3.12-slim

# Prevent Python from writing .pyc files and enable unbuffered logging
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Set the working directory
WORKDIR /home/app

# Install system build dependencies required for C-extensions (e.g., cffi, cryptography, numpy)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libffi-dev \
    libssl-dev \
    curl \
    && rm -rf /var/lib/apt-get/lists/*

# Create a non-privileged user to run the app safely
RUN adduser --disabled-password --gecos "" appuser

# Copy requirements file and install dependencies using wheel cache
COPY --chown=appuser:appuser requirements.txt .
RUN sed -i '/pywin32/d' requirements.txt && \
    pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY --chown=appuser:appuser . .

# Expose FastAPI/Uvicorn default port
EXPOSE 8000

# Start application using uvicorn (assuming entry point is main.py with 'app' FastAPI instance)
CMD ["python", "-m", "app.main"]