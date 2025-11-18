#!/usr/bin/env bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/health || exit 1
