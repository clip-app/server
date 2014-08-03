FROM dockerfile/nodejs

WORKDIR /app
ADD . /app

RUN npm install

CMD ["node", "app.js"]
