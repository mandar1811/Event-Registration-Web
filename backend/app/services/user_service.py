from app.models.user import User
from app.extensions import db, bcrypt

def create_user(username, email, password, is_admin=False):
    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(
        username=username,
        email=email,
        password_hash=password_hash,
        is_admin=is_admin  # ✅ Include this!
    )
    db.session.add(user)
    db.session.commit()
    return user


def find_user_by_username(username):
    return User.query.filter_by(username=username).first()

def check_password(user, password):
    return bcrypt.check_password_hash(user.password_hash, password)
