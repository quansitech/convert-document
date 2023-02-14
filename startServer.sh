#!/bin/bash

nohup X :0 -config /var/www/convert-document/dummy.conf > /dev/null 2>&1 &

nohup /opt/kingsoft/wps-office/office6/wps -multiply > /dev/null 2>&1 &

nohup node /var/www/convert-document/src/index.js > /dev/null 2>&1 &
