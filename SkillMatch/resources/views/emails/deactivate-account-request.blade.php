<!DOCTYPE html>
<html>
<head>
    <title>Account Deactivation Request</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .content { background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        .footer { margin-top: 20px; padding: 10px; font-size: 12px; color: #666; }
        .highlight { background-color: #fff3cd; padding: 10px; border-radius: 3px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Account Deactivation Request</h2>
        </div>
        
        <div class="content">
            <p>Dear Administrator,</p>
            
            <p>A user has requested to deactivate their account. Please review the following details:</p>
            
            <div class="highlight">
                <strong>User Details:</strong><br>
                <strong>Name:</strong> {{ $user_name }}<br>
                <strong>Email:</strong> {{ $user_email }}<br>
                <strong>User ID:</strong> {{ $user_id }}<br>
                <strong>Request Date:</strong> {{ $request_date }}
            </div>
            
            <p>Please take appropriate action to process this deactivation request.</p>
            
            <p>You can contact the user directly by replying to this email if you need additional information.</p>
            
            <p>Best regards,<br>
            System Administrator</p>
        </div>
        
        <div class="footer">
            <p>This is an automated message. Please do not reply directly to this email unless you need to contact the user.</p>
        </div>
    </div>
</body>
</html>