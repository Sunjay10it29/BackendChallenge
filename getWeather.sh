#!/bin/bash

ndate=`date +%m-%d-%Y-%T`

wget http://localhost:3000/api/getWeather

#curl -X GET \
#  https://www.rideindego.com/stations/json/ \
#  -H 'Postman-Token: 87d5d748-3004-409d-81f0-a155684c606f' \
#  -H 'cache-control: no-cache' > bike-$ndate.json
