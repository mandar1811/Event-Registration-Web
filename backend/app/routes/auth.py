from flask import Blueprint, request, jsonify
from app.services.user_service import create_user, find_user_by_username, check_password
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

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
            "is_admin": int(user.is_admin)  # Ensure it's 0 or 1 in the response
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
