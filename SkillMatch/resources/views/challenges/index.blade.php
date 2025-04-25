@extends('layouts.app')

@section('content')
<div class="container mx-auto px-4">
    <div class="bg-white rounded-lg shadow-md p-6">
        <h1 class="text-2xl font-bold mb-4">Problem list</h1>
        <table class="w-full table-auto border-collapse">
            <thead>
                <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    <th class="py-3 px-6 text-left">Title</th>
                    <th class="py-3 px-6 text-left">Description</th>
                    <th class="py-3 px-6 text-left">Skill</th>
                    <th class="py-3 px-6 text-left">Level</th>
                    <th class="py-3 px-6 text-left">Users</th>
                    <th class="py-3 px-6 text-center">Action</th>
                </tr>
            </thead>
            <tbody class="text-gray-600 text-sm font-light">
                @foreach($challenges as $challenge)
                    <tr class="border-b border-gray-200 hover:bg-gray-100">
                        <td class="py-3 px-6 text-left whitespace-nowrap">
                            {{ Str::limit($challenge->name, 30) }}
                        </td>
                        <td class="py-3 px-6 text-left">
                            {{ Str::limit($challenge->description, 50) }}
                        </td>
                        <td class="py-3 px-6 text-left">
                            <span class="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                                {{ $challenge->skill->name ?? 'N/A' }}
                            </span>
                        </td>
                        <td class="py-3 px-6 text-left">
                            @php
                                $levels = [
                                    'easy' => 'bg-green-200 text-green-800',
                                    'meduim' => 'bg-yellow-200 text-yellow-800',
                                    'hard' => 'bg-red-200 text-red-800',
                                    'expert' => 'bg-purple-200 text-purple-800'
                                ];
                            @endphp
                            <span class="text-xs font-semibold px-2 py-1 rounded {{ $levels[$challenge->level] ?? 'bg-gray-200' }}">
                                {{ ucfirst($challenge->level) }}
                            </span>
                        </td>
                        <td class="py-3 px-6 text-left">
                            @foreach ($challenge->candidates as $candidate)
                                <span class="block text-xs">{{ $candidate->name }}</span>
                            @endforeach
                        </td>

                        <td class="py-3 px-6 text-center">
                            <button class="bg-indigo-500 text-white px-3 py-1 text-xs rounded hover:bg-indigo-600">Resolve</button>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>
@endsection
