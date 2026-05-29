import os
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# SQLITE
SQLITE = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}
# POSTGRESQL
POSTGRESQL = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'prueba',
        'USER': 'cge',
        'PASSWORD': '123456',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}
# MYSQL
MYSQL = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'prueba',
        'USER': 'root',
        'PASSWORD': '123456',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}

#MSSQL
MSSQL = {
    'default': {
        'ENGINE': 'mssql',
        'NAME': 'prueba',
        'USER': 'cge',
        'PASSWORD': '123456',
        'HOST': 'localhost', #DESKTOP\SQLEXPRESS
        'PORT': '1433',
        'OPTIONS': {
            'driver': 'ODBC Driver 17 for SQL Server',
            'trusted_connection': 'yes',
        },
    },
}