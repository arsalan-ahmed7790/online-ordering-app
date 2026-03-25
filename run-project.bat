@echo off
echo Starting Backend...

cd backend
call venv\Scripts\activate
start cmd /k python run.py

echo Starting Frontend...

cd ..
cd app
start cmd /k npm run dev

echo Project is starting...
pause