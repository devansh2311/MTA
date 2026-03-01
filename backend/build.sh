#!/usr/bin/env bash
# exit on error
set -o errexit

# Upgrade pip and install requirements
pip install -U pip
pip install -r requirements.txt

# Run Django commands
python manage.py collectstatic --no-input
python manage.py migrate
