# ark-wab
#
# VERSION    1.0.0

FROM coolcao/nodejs-6.5
MAINTAINER me@coolcao.com

ENV HTTP_PORT 3000
ENV MONGO_URL mongodb://host:27017/db

COPY . /app
WORKDIR /app

# RUN npm install gulp -g
# RUN npm install --registry=https://registry.npm.taobao.org
# RUN gulp

EXPOSE 3000

CMD ["node", "bin/www"]
