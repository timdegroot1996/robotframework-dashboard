#!/usr/bin/env bash
set -e

pabot \
  --pabotlib \
  --testlevelsplit \
  --artifacts png,jpg \
  --artifactsinsubfolders \
  --processes 2 \
  -d results \
  atest/testsuites/*.robot