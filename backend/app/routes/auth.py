from flask import Blueprint, request, jsonify
from app.services.user_service import create_user, find_user_by_username, check_password
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models.user import User
from app.models.registration import Registration

auth_bp = Blueprint("auth", __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    # Check if the username already exists
    if find_user_by_username(data['username']):
        return jsonify({"msg": "Username already exists"}), 409
    
    # Optional admin flag (default: False)
    is_admin = data.get('is_admin', False)
    
    # Create the user
    create_user(data['username'], data['email'], data['password'], is_admin=is_admin)
    return jsonify({"msg": "User registered successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Find the user by username
    user = find_user_by_username(data['username'])

    # Check credentials
    if user and check_password(user, data['password']):
        # Create the access token
        access_token = create_access_token(
            identity=str(user.id),  # User ID as the identity
            additional_claims={"username": user.username,"is_admin": user.is_admin}  # Additional claim with username
        )
        return jsonify({
            "access_token": access_token,
            "is_admin": int(user.is_admin) ,
             "username":user.username # Ensure it's 0 or 1 in the response
        }), 200

    return jsonify({"msg": "Invalid credentials"}), 401

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    user_id = get_jwt_identity()  # Get user ID from the token
    print(f"User logging out: {user_id}")
    return jsonify({"msg": "Logout handled client-side"}), 200

@auth_bp.route('/test-protected', methods=['GET'])
@jwt_required()
def test_protected():
    identity = get_jwt_identity()  # Get the user ID from the token
    
    # You can use the ID to fetch the user from DB if needed
    # e.g., user = User.query.get(identity)
    
    return jsonify({"logged_in_as": identity}), 200

@auth_bp.route('/users', methods=['GET'])
@jwt_required()
def get_all_users():
    # Optional: Check if requester is admin
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user or not user.is_admin:
        return jsonify({"msg": "Admins only"}), 403

    users = User.query.all()
    user_data = [
        {
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "is_admin": u.is_admin
        }
        for u in users
    ]

    return jsonify(user_data), 200

@auth_bp.route('/registrations/<int:event_id>', methods=['DELETE'])
@jwt_required()
def delete_registration(event_id):
    user_id = get_jwt_identity()

    # Find the registration for this user and event
    registration = Registration.query.filter_by(user_id=user_id, event_id=event_id).first()

    if not registration:
        return jsonify({"msg": "Registration not found"}), 404

    # If found, delete it
    from app.extensions import db  # (Import db if not already imported)
    db.session.delete(registration)
    db.session.commit()

    return jsonify({"msg": "Registration deleted successfully"}), 200

