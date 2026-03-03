#!/bin/bash

echo "Starting ThingsBoard Dev Environment..."

echo "Step 1: Starting PostgreSQL..."
docker compose up -d tb-postgres

echo "Waiting for DB to be ready..."
sleep 20

echo "Checking if TB install needed..."

docker compose logs thingsboard 2>/dev/null | grep -q "Started ThingsBoard"

if [ $? -ne 0 ]; then
  echo "Running TB schema install..."
  docker compose run --rm \
    -e INSTALL_TB=true \
    -e LOAD_DEMO=false \
    thingsboard
else
  echo "TB already initialized, skipping install."
fi


echo "Step 3: Starting full stack..."
docker compose up -d

echo "ThingsBoard Dev Environment Ready!"
echo "Open http://localhost:8080"
