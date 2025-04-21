from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.user import User
from app.models.event import Event
from app.models.registration import Registration

registration_bp = Blueprint('registration', __name__)

@registration_bp.route('/events/<int:event_id>/register', methods=['POST'])
@jwt_required()
def register_for_event(event_id):
    # Retrieve the user ID from the JWT identity
    user_id = get_jwt_identity()  # Identity should just be the user ID
    user = User.query.get(user_id)  # Fetch the user from the database

    if not user:
        return jsonify({"msg": "User not found"}), 404

    # Fetch the event by event_id
    event = Event.query.get(event_id)

    if not event:
        return jsonify({"msg": "Event not found"}), 404

    # Check if the event is full
    if len(event.registrations) >= event.capacity:
        return jsonify({"msg": "Event is full"}), 400

    # Check if the user is already registered for the event
    already_registered = Registration.query.filter_by(user_id=user.id, event_id=event_id).first()
    if already_registered:
        return jsonify({"msg": "User already registered for this event"}), 400

    # Register the user for the event
    registration = Registration(user_id=user.id, event_id=event_id)
    db.session.add(registration)
    db.session.commit()

    return jsonify({"msg": f"User {user.username} registered for event {event.title}"}), 201

@registration_bp.route('/my-registrations', methods=['GET'])
@jwt_required()
def get_my_registrations():
    # Get the user ID from the JWT identity (identity is a string, not a dictionary)
    user_id = get_jwt_identity()

    # Retrieve the user object from the database
    user = User.query.get(user_id)

    # If user is not found, return an error message
    if not user:
        return jsonify({"msg": "User not found"}), 404

    # Fetch all event registrations for this user
    registrations = [{
        "event_id": r.event.id,
        "title": r.event.title,
        "description": r.event.description,
        "venue": r.event.venue,
        "price": r.event.price,
        "date":r.event.date,
        "category":r.event.category,
        "image_url":r.event.image_url
    } for r in user.registrations]

    # Return the registrations as a JSON response
    return jsonify(registrations), 200

@registration_bp.route('/registrations', methods=['GET'])
@jwt_required()
def get_all_registrations():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or not user.is_admin:
        return jsonify({"msg": "Admins only"}), 403

    registrations = Registration.query.all()
    data = []

    for reg in registrations:
        data.append({
            "id": reg.id,
            "user_id": reg.user_id,
            "username": reg.user.username if reg.user else None,
            "event_id": reg.event_id,
            "event_title": reg.event.title if reg.event else None
        })

    return jsonify(data), 200
