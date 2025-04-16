from app.models.event import Event
from app.extensions import db
from datetime import datetime

def create_event(data):
    allowed_fields = {'title', 'description', 'capacity', 'venue', 'price', 'image_url', 'date', 'category'}
    filtered_data = {k: v for k, v in data.items() if k in allowed_fields}

    # Parse the date string to a datetime object
    if 'date' in filtered_data:
        filtered_data['date'] = datetime.strptime(filtered_data['date'], "%Y-%m-%d")

    event = Event(**filtered_data)
    db.session.add(event)
    db.session.commit()
    return event

def get_all_events():
    events = Event.query.all()
    return [
        {
            "id": event.id,
            "title": event.title,
            "description": event.description,
            "capacity": event.capacity,
            "venue": event.venue,
            "price": event.price,
            "image_url": event.image_url,
            "date": event.date.strftime('%Y-%m-%d') if event.date else None,
            "category": event.category,
            "registrations": len(event.registrations) if hasattr(event, "registrations") else 0
        }
        for event in events
    ]

def get_event_by_id(event_id):
    event = Event.query.get(event_id)
    if event is None:
        return None
    return {
        "id": event.id,
        "title": event.title,
        "description": event.description,
        "capacity": event.capacity,
        "venue": event.venue,
        "price": event.price,
        "image_url": event.image_url,
        "date": event.date.strftime('%Y-%m-%d') if event.date else None,
        "category": event.category,
        "registrations": len(event.registrations) if hasattr(event, "registrations") else 0
    }

def update_event(event_id, data):
    event = Event.query.get_or_404(event_id)
    for key, value in data.items():
        if key == "date":
            value = datetime.strptime(value, "%Y-%m-%d")
        setattr(event, key, value)
    db.session.commit()
    return event

def delete_event(event_id):
    event = Event.query.get_or_404(event_id)
    db.session.delete(event)
    db.session.commit()
