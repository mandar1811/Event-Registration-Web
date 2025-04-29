from flask import Blueprint, request, jsonify,abort
from flask_jwt_extended import jwt_required
from app.utils.auth_helpers import admin_required
from app.services import event_service
from app.extensions import db
from app.models.registration import Registration
from app.models.user import User
from flask import current_app, url_for
from flask.testing import FlaskClient


event_bp = Blueprint('event', __name__)

@event_bp.route('/events', methods=['POST'])
@jwt_required()
@admin_required
def create():
    data = request.get_json()
    event = event_service.create_event(data)
    return jsonify({"msg": "Event created", "event_id": event.id}), 201

@event_bp.route('/events', methods=['GET'])
def list_all():
    events = event_service.get_all_events()
    return jsonify(events)
    
@event_bp.route("/event/<int:event_id>", methods=["GET"])
def get_event(event_id):
    event = event_service.get_event_by_id(event_id)
    if not event:
        abort(404, description="Event not found")
    return jsonify(event)

@event_bp.route('/events/<int:event_id>', methods=['PUT'])
@jwt_required()
@admin_required
def update(event_id):
    data = request.get_json()
    event = event_service.update_event(event_id, data)
    return jsonify({"msg": "Event updated", "event_id": event.id})

@event_bp.route('/events/<int:event_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_event(event_id):
    # Find all registrations for this event
    registrations = Registration.query.filter_by(event_id=event_id).all()

    if not registrations:
        return jsonify({"msg": "No registrations found for this event"}), 404

    # Prepare user data for emails
    users = []
    for reg in registrations:
        user = User.query.get(reg.user_id)
        if user:
            users.append({
                "name": user.username,
                "email": user.email
            })

    # Get event info for email
    event = event_service.get_event_by_id(event_id)
    if not event:
        return jsonify({"msg": "Event not found"}), 404

    payload = {
        "users": users,
        "event_name": event['title'],
        "event_date": event['date'],   # Format the date
        "event_venue": event['venue']
    }

    # Use Flask's internal client to call send-cancellation directly
    try:
        with current_app.test_client() as client:
            response = client.post(
                url_for('email.send_cancellation'),
                json=payload,
                content_type='application/json'
            )
            if response.status_code != 200:
                raise Exception(f"Error sending cancellation emails: {response.data}")

    except Exception as e:
        print("Failed to send cancellation emails:", e)

    # Delete registrations
    for registration in registrations:
        db.session.delete(registration)

    # Delete the event
    event_service.delete_event(event_id)

    # Commit to save changes
    db.session.commit()

    return jsonify({"msg": "Event and related registrations deleted, emails sent"}), 200