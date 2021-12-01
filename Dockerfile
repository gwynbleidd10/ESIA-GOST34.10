FROM rnix/openssl-gost

RUN apt-get update && apt-get upgrade curl -y

WORKDIR /API

# RUN curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n && bash n lts

ADD package*.json /API/
RUN npm install --production
COPY . /API

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]