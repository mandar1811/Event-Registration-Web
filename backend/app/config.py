import os

class Config:
    # App secrets
    SECRET_KEY = os.environ.get("SECRET_KEY", "supersecretkey")
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "jwt-secret")

    # Database
    SQLALCHEMY_DATABASE_URI = "mysql+mysqlconnector://root:root123@localhost/event_db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Flask-Mail configuration
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = 'mandar.deshmukh@jadeglobal.com'
    MAIL_PASSWORD = 'lbzg uwfr mmoe jxpa'  # Use App Password (NOT regular password)
    MAIL_DEFAULT_SENDER = 'mandar.deshmukh@jade.global.com'
