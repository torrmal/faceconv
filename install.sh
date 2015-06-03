#!/bin/bash

# IP or URL of the server you want to deploy to


# Uncomment this if your host is an EC2 instance
# EC2_PEM_FILE=path/to/your/file.pem

# You usually don't need to change anything below this line
APP_HOST=54.164.156.112
APP_NAME=meteorapp
ROOT_URL=http://$APP_HOST
PORT=80
APP_DIR=/var/www/$APP_NAME
MONGO_URL=mongodb://localhost:27017/$APP_NAME

EC2_PEM_FILE=gpu.pem
STATIC_FILES_PATH=/var/rlafiles
METEOR_CMD=meteor


chmod 700 $EC2_PEM_FILE

if [ -z "$EC2_PEM_FILE" ]; then
    SSH_HOST="ubuntu@$APP_HOST" SSH_OPT=""
  else
    SSH_HOST="ubuntu@$APP_HOST" SSH_OPT="-i $EC2_PEM_FILE"
fi




case "$1" in
setup )
echo Preparing the server...
echo Get some coffee, this will take a while.
ssh $SSH_OPT $SSH_HOST DEBIAN_FRONTEND=noninteractive 'sudo su -'  <<'ENDSSH'
apt-get update
apt-get install -y git
apt-get install -y python-software-properties
add-apt-repository ppa:chris-lea/node.js
apt-get update
apt-get install -y build-essential nodejs mongodb
apt-get install  -y libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++
npm update
npm install -g forever
npm install -g MD5
npm install -g mime
npm install -g decompress-zip
npm install -g underscore
npm install -g fibers
npm install -g node-base64-image --save
npm install source-map-support
npm install semver
npm install -g canvas
npm install -g md5
npm install -g minimist
npm install -g HTTPRequest
npm install -g convnetjs
ENDSSH
echo Done. You can now deploy your app.
;;
deploy )
echo Deploying...

ssh $SSH_OPT $SSH_HOST PORT=$PORT MONGO_URL=$MONGO_URL ROOT_URL=$ROOT_URL APP_DIR=$APP_DIR 'sudo su -'  <<'ENDSSH'
pushd /home/ubuntu/faceconv
forever stopall
forever stopall
forever start facefeatures.js --net=convnetjs_32_32_3_sf 
forever start facefeatures.js --net=convnetjs_64_64_3  
ENDSSH
echo Your app is deployed and serving on: $ROOT_URL
;;
connect )
echo Connecting ...
ssh $SSH_OPT $SSH_HOST
;;
* )
cat <<'ENDCAT'
./meteor.sh [action]

Available actions:

  setup   - Install a meteor environment on a fresh Ubuntu server
  deploy  - Deploy the app to the server
  conenct - Connect to the host
ENDCAT
;;
esac
