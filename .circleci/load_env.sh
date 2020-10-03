#!/bin/sh

echo 'export GITHUB_REPO=GladysAssistant/Gladys' >>$BASH_ENV

echo 'export IMAGE_ID="${DOCKERHUB_REPO}:${VERSION}-${TAG}"' >>$BASH_ENV
echo 'export DIR=`pwd`' >>$BASH_ENV
echo 'export QEMU_VERSION="v5.1.0-2"' >>$BASH_ENV

. $BASH_ENV
