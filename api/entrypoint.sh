#!/bin/sh
set -eu

HOST="${POSTGRES_HOST:-db}"
PORT="${POSTGRES_PORT:-5432}"

python - <<'PY'
import os, socket, time
host=os.environ.get('POSTGRES_HOST','db')
port=int(os.environ.get('POSTGRES_PORT','5432'))

deadline=time.time()+60
last=None
while time.time()<deadline:
    try:
        socket.getaddrinfo(host, port)
        s=socket.create_connection((host, port), timeout=2)
        s.close()
        print('DB is reachable')
        raise SystemExit(0)
    except Exception as e:
        last=e
        time.sleep(1)
print(f'Failed to reach DB {host}:{port}: {last}')
raise SystemExit(1)
PY

python manage.py migrate
python manage.py shell -c "from django.contrib.auth import get_user_model; User=get_user_model(); email='admin@admin.com'; password='admin'; u=User.objects.filter(email=email).first(); (User.objects.create_superuser(email=email, password=password), print('Created default superuser:', email)) if not u else print('Default superuser already exists:', email)"
python manage.py runserver 0.0.0.0:8000
