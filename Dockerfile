FROM node:11 as builder

WORKDIR /build

ADD . /build
RUN npm install -g bower grunt && \
    npm install && \
    bower install --allow-root && \
    grunt prod

FROM nginx:stable-alpine
COPY --from=builder /build/dist/ /usr/share/nginx/html
