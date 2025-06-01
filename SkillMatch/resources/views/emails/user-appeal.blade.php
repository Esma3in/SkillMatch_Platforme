<!DOCTYPE html>
<html>
<head>
    <title>User Appeal</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 700px; margin: 0 auto; padding: 20px; }
        .header { background-color: #e3f2fd; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .content { background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        .user-info { background-color: #f8f9fa; padding: 15px; border-radius: 3px; margin: 15px 0; }
        .appeal-message { background-color: #fff8e1; padding: 20px; border-left: 4px solid #ffc107; margin: 20px 0; }
        .footer { margin-top: 20px; padding: 10px; font-size: 12px; color: #666; }
        .priority { color: #d32f2f; font-weight: bold; }
        .date { color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>🔔 User Appeal Received</h2>
            <p class="date">Received on: {{ $request_date }}</p>
        </div>
        
        <div class="content">
            <p>Dear Administrator,</p>
            
            <p>A user has submitted an appeal that requires your attention. Please review the details below:</p>
            
            <div class="user-info">
                <h3>👤 User Information</h3>
                <strong>Name:</strong> {{ $user_name }}<br>
                <strong>Email:</strong> {{ $user_email }}<br>
                <strong>User ID:</strong> {{ $user_id }}<br>
                <strong>Submission Date:</strong> {{ $request_date }}
            </div>
            
            <div class="appeal-message">
                <h3>📝 Appeal Message</h3>
                <p><strong>Preview:</strong> {{ $appeal_preview }}...</p>
                
                <hr style="margin: 15px 0; border: none; border-top: 1px solid #ddd;">
                
                <h4>Full Appeal:</h4>
                <div style="white-space: pre-line; background: #fff; padding: 15px; border: 1px solid #ddd; border-radius: 3px;">{{ $appeal_message }}</div>
            </div>
            
            <div style="background-color: #e8f5e8; padding: 15px; border-radius: 3px; margin: 20px 0;">
                <h3>📋 Next Steps</h3>
                <ul>
                    <li>Review the user's appeal carefully</li>
                    <li>Check user's account history if needed</li>
                    <li>Reply directly to this email to respond to the user</li>
                    <li>Update any relevant systems or records</li>
                </ul>
            </div>
            
            <p><strong>Note:</strong> You can reply directly to this email to communicate with the user.</p>
            
            <p>Best regards,<br>
            System Notification</p>
        </div>
        
        <div class="footer">
            <p>This is an automated message. Reply to this email to contact the user directly at {{ $user_email }}.</p>
        </div>
    </div>
</body>
</html>