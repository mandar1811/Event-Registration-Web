from flask import Blueprint, request, jsonify
from flask_mail import Message
from app.extensions import mail

email_bp = Blueprint('email', __name__)

@email_bp.route('/send-confirmation', methods=['POST', 'OPTIONS'])
def send_confirmation():
    # Handle preflight CORS request
    if request.method == 'OPTIONS':
        return '', 200

    data = request.json

    try:
        msg = Message(
            subject=f"Registration Confirmation - {data['event_name']}",
            recipients=[data['user_email']],
            body=(
                f"Hello {data['user_name']},\n\n"
                f"Thank you for registering for {data['event_name']}.\n"
                f"Date: {data['event_date']}\n"
                f"Venue: {data['event_venue']}\n"
                f"Category: {data['event_category']}\n"
                f"Price: {data['event_price']}\n\n"
                "We look forward to seeing you there!\n\n"
                "Regards,\nEvent Hub Team"
            )
        )
        mail.send(msg)
        return jsonify({"message": "Email sent successfully"}), 200

    except Exception as e:
        print(e)
        return jsonify({"error": "Failed to send email"}), 500

# @email_bp.route('/send-cancellation', methods=['POST', 'OPTIONS'])
# def send_cancellation():

    # Handle preflight CORS request
    if request.method == 'OPTIONS':
        return '', 200

    data = request.json  # Expecting a list of users and event details

    try:
        users = data.get('users', [])
        event_name = data.get('event_name')
        event_date = data.get('event_date')
        event_venue = data.get('event_venue')

        for user in users:
            msg = Message(
                subject=f"Event Cancellation - {event_name}",
                recipients=[user['email']],
                body=(
                    f"Hello {user['name']},\n\n"
                    f"We regret to inform you that the event '{event_name}', originally scheduled for {event_date} at {event_venue}, "
                    "has been canceled.\n\n"
                    "We apologize for the inconvenience.\n\n"
                    "Regards,\nEvent Portal Team"
                )
            )
            mail.send(msg)

        return jsonify({"message": "Cancellation emails sent successfully"}), 200

    except Exception as e:
        print(e)
        return jsonify({"error": "Failed to send cancellation emails"}), 500

@email_bp.route('/send-cancellation', methods=['POST', 'OPTIONS'])
def send_cancellation():
    # Handle preflight CORS request
    if request.method == 'OPTIONS':
        return '', 200

    data = request.json  # Expecting a list of users and event details

    try:
        users = data.get('users', [])
        event_name = data.get('event_name')
        event_date = data.get('event_date')
        event_venue = data.get('event_venue')

        for user in users:
            msg = Message(
                subject=f"Event Cancellation - {event_name}",
                recipients=[user['email']],
                body=(
                    f"Hello {user['name']},\n\n"
                    f"We regret to inform you that the event '{event_name}', originally scheduled for {event_date} at {event_venue}, "
                    "has been cancelled.\n\n"
                    "We apologize for the inconvenience.\n\n"
                    "Regards,\nEvent Portal Team"
                )
            )
            mail.send(msg)

        return jsonify({"message": "Cancellation emails sent successfully"}), 200

    except Exception as e:
        print(e)
        return jsonify({"error": "Failed to send cancellation emails"}), 500