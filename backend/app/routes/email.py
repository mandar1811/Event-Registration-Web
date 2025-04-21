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
                "Regards,\nEvent Portal Team"
            )
        )
        mail.send(msg)
        return jsonify({"message": "Email sent successfully"}), 200

    except Exception as e:
        print(e)
        return jsonify({"error": "Failed to send email"}), 500
