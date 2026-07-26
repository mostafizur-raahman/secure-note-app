up:
    docker compose up --build -d

down:
    docker compose down

local:
    cd client && npm run dev &
    cd server && npm run run:dev &