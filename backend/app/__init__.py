from flask import Flask
from app.config import Config
from app.extensions import db, bcrypt, jwt
from app.routes import register_routes
from .extensions import cors
from .extensions import mail
def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/*": {"origins": "*"}})
    # Register routes
    register_routes(app)
    # print("Connected to:", app.config["SQLALCHEMY_DATABASE_URI"])
    mail.init_app(app)


    return app
