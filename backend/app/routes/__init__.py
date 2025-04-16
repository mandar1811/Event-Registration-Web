from app.routes.auth import auth_bp
from app.routes.event_routes import event_bp  
from app.routes.registration import registration_bp
def register_routes(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(event_bp)
    app.register_blueprint(registration_bp)
