from flask import Blueprint, request, jsonify,abort
from flask_jwt_extended import jwt_required
from app.utils.auth_helpers import admin_required
from app.services import event_service

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
def delete(event_id):
    event_service.delete_event(event_id)
    return jsonify({"msg": "Event deleted"})

