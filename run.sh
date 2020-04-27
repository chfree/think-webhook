#!/bin/bash
DATE=$(date +%Y-%m-%d-%H-%M-%S)
npm run start >> /home/logs/think-webhook/webhook.$DATE.log 2>&1