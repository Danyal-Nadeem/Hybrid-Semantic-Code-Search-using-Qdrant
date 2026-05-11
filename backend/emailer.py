import smtplib
import random
import os
from email.message import EmailMessage

def send_verification_email(recipient_email):
    """
    Generates a random 6-digit code and sends it to the provided email.
    
    Args:
        recipient_email (str): The email address to send the code to.
        
    Returns:
        tuple: (bool success_status, int/None verification_code)
    """
    # 1. Generate a random 6-digit verification code
    verification_code = random.randint(100000, 999999)
    
    # 2. Email credentials (Replace with your own or use environment variables)
    # It is highly recommended to use environment variables for security.
    sender_email = os.getenv("SENDER_EMAIL", "danyalnadeem288@gmail.com")
    sender_password = os.getenv("SENDER_PASSWORD", "mbqx mbjf uvsq lukt")
    
    # 3. Construct the email
    msg = EmailMessage()
    msg['Subject'] = 'Your Verification Code'
    msg['From'] = sender_email
    msg['To'] = recipient_email
    
    email_body = (
        f"Hello,\n\n"
        f"Your email verification code is: {verification_code}\n\n"
        f"Please enter this code in the application to proceed.\n\n"
        f"If you did not request this, please ignore this email."
    )
    msg.set_content(email_body)
    
    # 4. Connect to SMTP server and send the email
    try:
        # Using Gmail's SMTP server with SSL on port 465
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(sender_email, sender_password)
            smtp.send_message(msg)
            
        return True, verification_code
        
    except smtplib.SMTPRecipientsRefused:
        print(f"Error: Recipient {recipient_email} refused by server.")
        return False, "Email address does not exist or cannot receive emails."
    except smtplib.SMTPAuthenticationError:
        print("Error: SMTP Authentication failed. Check sender credentials.")
        return False, "Server email configuration error."
    except Exception as e:
        print(f"Error sending email: {e}")
        return False, "Failed to send verification email."