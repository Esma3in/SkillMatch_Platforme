<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Candidate CV</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f7fafc;
            color: #2d3748;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 900px;
            margin: 40px auto;
            padding: 20px;
            background-color: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
        }

        .header {
            display: flex;
            justify-content: space-between;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 20px;
            margin-bottom: 20px;
        }

        .header .info {
            max-width: 70%;
        }

        .header img {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            border: 2px solid #3182ce;
            object-fit: cover;
        }

        .header h1 {
            font-size: 28px;
            font-weight: bold;
        }

        .header p {
            font-size: 18px;
            color: #718096;
        }

        .section {
            margin-top: 40px;
        }

        .section h2 {
            font-size: 22px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .section p {
            font-size: 16px;
            color: #4a5568;
            line-height: 1.6;
        }

        .section ul {
            list-style-type: disc;
            margin-left: 20px;
        }

        .section ul li {
            font-size: 16px;
            color: #4a5568;
        }

        .section strong {
            font-weight: bold;
        }

        .bio p {
            white-space: pre-line;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="info">
                <h1>{{ $candidate->name }} {{$candidate->profile->last_name}}</h1>
                <p>{{ $candidate->profile->field }}</p>
            </div>
            @if($candidate->profile->photoProfil)
            <img src="{{ asset('storage/' . $candidate->profile->photoProfil) }}" alt="Profile Photo">
            @endif
        </div>

        <div class="section">
            <h2>Contact Information</h2>
            <p><strong>Email:</strong> {{ $candidate->email }}</p>
            <p><strong>Phone:</strong> {{ $candidate->profile->phoneNumber }}</p>
            <p><strong>Location:</strong> {{ $candidate->profile->localisation }}</p>
        </div>

        <div class="section">
            <h2>Languages</h2>
            <ul>
                @foreach($candidate->languages as $language)
                    <li>{{ $language->language }} - <span style="font-size: 14px; color: #a0aec0;">{{ $language->level }}</span></li>
                @endforeach
            </ul>
        </div>

        <div class="section bio">
            <h2>Bio</h2>
            <p>{{ $candidate->profile->description }}</p>
        </div>

        {{-- Optional: Add skills, education, experience sections --}}
    </div>
</body>
</html>
