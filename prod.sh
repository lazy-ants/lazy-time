#!/bin/bash
docker-compose up -d --build
docker exec -ti lazy-time_nodejs npm install
docker exec -ti lazy-time_nodejs bash -c 'npm run copy:libs'
docker exec -ti lazy-time_nodejs bash -c 'npm run build -- --prod'
