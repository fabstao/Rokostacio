FROM node:carbon

ARG mongohost="localhost"
ENV mongohost
ARG mongoport="27017"
ENV mongoport
ARG dbname="rokostacio"
ENV dbname

RUN useradd -d /home/fsalaman -m fsalaman
RUN apt-get -y install git
RUN su - fsalaman -c "mkdir -p src/nodejs"
RUN su - fsalaman -c "cd src/nodejs"
RUN su - fsalaman -c "git clone https://github.com/fabstao/rokostacio"
RUN su - fsalaman -c "cd rokostacio && rm -rf node_modules && npm install"
RUN su - fsalaman -c 'echo "//ROKOStacio configuration file" > conf.js'
RUN su - fsalaman -c 'echo "" >> conf.js'
RUN su - fsalaman -c 'echo "module.exports {" >> conf.js'
RUN su - fsalaman -c 'echo "     dbserver : \"${mongohost}\"," >> conf.js'
RUN su - fsalaman -c 'echo "     dbport : \"${mongoport}\"," >> conf.js'
RUN su - fsalaman -c 'echo "     dbname : \"${dbname}\"," >> conf.js'
RUN su - fsalaman -c 'echo "}" >> conf.js'
WORKDIR /home/fsalaman/src/nodejs/rokostacio

USER fsalaman

EXPOSE 3201

CMD ["app.sh"]
