#!/bin/bash

find /tmp -name .X0-lock | xargs  rm -rf

nohup X :0 -config /var/www/convert-document/dummy.conf > /dev/null 2>&1 &

nohup /opt/kingsoft/wps-office/office6/wps -multiply > /dev/null 2>&1 &
