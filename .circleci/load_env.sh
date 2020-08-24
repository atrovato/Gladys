#!/bin/sh

echo 'export GITHUB_REPO=atrovato/gladys-tasmota-http' >>$BASH_ENV
echo 'export IMAGE=gladys-tasmota-http' >>$BASH_ENV
echo 'export REGISTRY=atrovato' >>$BASH_ENV

echo 'export VERSION=4.0.0-beta-tasmota-http' >>$BASH_ENV
echo 'export IMAGE_ID="${REGISTRY}/${IMAGE}:${VERSION}-${TAG}"' >>$BASH_ENV
echo 'export DIR=`pwd`' >>$BASH_ENV
echo 'export QEMU_VERSION="v4.0.0"' >>$BASH_ENV

. $BASH_ENV
