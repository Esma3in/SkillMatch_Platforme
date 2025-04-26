<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Challenges List</title>
    <style>
        /* CSS Reset */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            background-color: #f3f4f6;
            color: #333;
            min-height: 100vh;
        }

        .container {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 1rem;
        }

        h1 {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 1rem;
        }

        table {
            width: 100%;
            background-color: white;
            border-collapse: collapse;
        }

        th, td {
            padding: 0.5rem 1rem;
            text-align: center;
        }

        th {
            font-weight: bold;
        }

        tr.border-t {
            border-top: 1px solid #e5e7eb;
        }

        .rounded {
            border-radius: 0.25rem;
        }

        .bg-blue-100 {
            background-color: #dbeafe;
        }

        .text-blue-800 {
            color: #1e40af;
        }

        .bg-yellow-100 {
            background-color: #fef3c7;
        }

        .text-yellow-800 {
            color: #92400e;
        }

        .px-2 {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
        }

        .py-1 {
            padding-top: 0.25rem;
            padding-bottom: 0.25rem;
        }

        .py-2 {
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
        }

        .py-4 {
            padding-top: 1rem;
            padding-bottom: 1rem;
        }

        .px-4 {
            padding-left: 1rem;
            padding-right: 1rem;
        }

        .mt-4 {
            margin-top: 1rem;
        }

        .bg-indigo-500 {
            background-color: #6366f1;
        }

        .hover\:bg-indigo-700:hover {
            background-color: #4338ca;
        }

        .text-white {
            color: white;
        }

        .font-bold {
            font-weight: bold;
        }

        a.bg-indigo-500 {
            display: inline-block;
            text-decoration: none;
            border-radius: 0.25rem;
            transition: background-color 0.2s;
        }

        .pagination {
            display: flex;
            list-style: none;
            justify-content: center;
            margin-top: 1rem;
        }

        .pagination li {
            margin: 0 0.25rem;
        }

        .pagination a, .pagination span {
            display: inline-block;
            padding: 0.5rem 0.75rem;
            background-color: white;
            border: 1px solid #e5e7eb;
            border-radius: 0.25rem;
            text-decoration: none;
            color: #333;
        }

        .pagination .active span {
            background-color: #6366f1;
            color: white;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Challenges List</h1>
        <table>
            <thead>
                <tr>
                    <th class="px-4 py-2">Title</th>
                    <th class="px-4 py-2">Description</th>
                    <th class="px-4 py-2">Skill</th>
                    <th class="px-4 py-2">Level</th>
                    <th class="px-4 py-2">Number Users Resolved</th>
                    <th class="px-4 py-2">Action</th>
                </tr>
            </thead>
            <tbody>
                @if($challenges->count() > 0)
                    @foreach($challenges as $challenge)
                        <tr class="text-center border-t">
                            <td class="px-4 py-2">{{ $challenge->name }}</td>
                            <td class="px-4 py-2">{{ Str::limit($challenge->description, 50) }}</td>
                            <td class="px-4 py-2">
                                <span class="px-2 py-1 rounded bg-blue-100 text-blue-800">
                                    {{ $challenge->skill->name }}
                                </span>
                            </td>
                            <td class="px-4 py-2">
                                <span class="px-2 py-1 rounded bg-yellow-100 text-yellow-800">
                                    {{ ucfirst($challenge->level) }}
                                </span>
                            </td>
                            <td class="px-4 py-2">{{ $challenge->candidates_count }}</td>
                            <td class="px-4 py-2">
                                <a href="{{ route('challenges.show', $challenge) }}" class="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                                    Start
                                </a>
                            </td>
                        </tr>
                    @endforeach
                @else
                    <tr>
                        <td colspan="6" class="text-center py-4">Aucun challenge disponible pour le moment.</td>
                    </tr>
                @endif
            </tbody>
        </table>
        <div class="mt-4">
            {{ $challenges->links() }}
        </div>
    </div>
</body>
</html>
