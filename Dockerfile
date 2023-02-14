FROM ubuntu:20.04

LABEL org.opencontainers.image.title="convert-document"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.documentation="https://github.com/quansitech/convert-document/blob/master/README.md"
LABEL org.opencontainers.image.source="https://github.com/quansitech/convert-document"
LABEL org.opencontainers.image.url="https://github.com/quansitech/convert-document"

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get -y upgrade && \
    apt-get install python3-pip -y && \
    apt-get install wget curl -y && \
    apt-get install ghostscript -y && \
    apt-get install qt5-default -y && \
    apt-get install xserver-xorg-video-dummy -y && \
    apt-get install xorg openbox -y && \
    apt-get install ttf-mscorefonts-installer -y --force-yes && \
    apt-get install fontconfig -y  && \
    apt-get install libglu1-mesa -y && \
    apt-get install xdg-utils -y

WORKDIR "/var/www/convert-document"

RUN curl -sL https://deb.nodesource.com/setup_14.x -o setup_14.sh && \
    sh ./setup_14.sh && \
    apt-get install -y nodejs && \
    npm install -g yarn

COPY ./dummy.conf dummy.conf

RUN wget https://wdl1.cache.wps.cn/wps/download/ep/Linux2019/10161/wps-office_11.1.0.10161_amd64.deb && \
    dpkg -i wps-office_11.1.0.10161_amd64.deb

COPY ./wps-package/wps_symbol_fonts /usr/share/fonts/wps-office/

COPY ./wps-package/wins_fonts /usr/share/fonts/wins_fonts/

WORKDIR "/usr/share/fonts/wps-office/"

RUN chmod 755 /usr/share/fonts/wps-office/*.ttf && \
    mkfontscale && mkfontdir &&  fc-cache -fv

WORKDIR "/usr/share/fonts/wins_fonts/"

RUN chmod 755 /usr/share/fonts/wins_fonts/* && \
    mkfontscale && mkfontdir &&  fc-cache -fv

RUN pip3 install --timeout=1000 pywpsrpc==2.3.3

COPY ./startServer.sh /var/www/convert-document/startServer.sh

RUN chmod +x /var/www/convert-document/startServer.sh

COPY ./Office.conf /root/.config/Kingsoft/Office.conf

COPY ./src /var/www/convert-document/src

WORKDIR "/var/www/convert-document/src"

RUN yarn install

ENTRYPOINT ["bash", "-c","/var/www/convert-document/startServer.sh && tail -f /dev/null"]