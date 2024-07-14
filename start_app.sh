#!/bin/bash
source /root/.nvm/nvm.sh
cd /home/price-comparator
npm start >> /home/price-comparator/app.log 2>&1
