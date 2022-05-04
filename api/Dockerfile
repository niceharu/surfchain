FROM node:16

RUN apt-get update || : && apt-get install python -y

WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app

# 실행 명령어
CMD ["npm", "run", "start"]