FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY . /usr/share/nginx/html

# Wichtig: kein USER web/nginx setzen
EXPOSE 80
