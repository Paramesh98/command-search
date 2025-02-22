import React, { useState } from 'react';
import nlp from 'compromise';

const sampleData = [
  { id: 1, name: 'Alice', city: 'Dortmund', age: 25 },
  { id: 2, name: 'Bob', city: 'Berlin', age: 30 },
  { id: 3, name: 'Charlie', city: 'Dortmund', age: 35 },
  { id: 4, name: 'David', city: 'Munich', age: 28 },
  { id: 5, name: 'Eva', city: 'Dortmund', age: 40 },
  { id: 6, name: 'Frank', city: 'Cologne', age: 22 },
  { id: 7, name: 'Grace', city: 'Dortmund', age: 31 },
  { id: 8, name: 'Helen', city: 'Berlin', age: 27 },
  { id: 9, name: 'Ian', city: 'Munich', age: 29 },
  { id: 10, name: 'Jack', city: 'Dortmund', age: 33 },
];

const parseCommand = (command, data) => {
  let doc = nlp(command);
  console.log('doc', doc);
  let number = doc.values().toNumber().out('text');
  const limit = number ? parseInt(number, 10) : data.length;

  const cityMatch = command.match(/(?:live in|from)\s+([a-zA-Z]+)/i);
  const city = cityMatch ? cityMatch[1] : null;

  const ageMatch = command.match(/older than (\d+)/i);
  const minAge = ageMatch ? parseInt(ageMatch[1], 10) : null;

  const nameMatch = command.match(/named\s+([a-zA-Z]+)/i);
  const name = nameMatch ? nameMatch[1] : null;

  let filteredData = data;

  if (city)
    filteredData = filteredData.filter(
      (user) => user.city.toLowerCase() === city.toLowerCase()
    );
  if (minAge !== null)
    filteredData = filteredData.filter((user) => user.age > minAge);
  if (name)
    filteredData = filteredData.filter(
      (user) => user.name.toLowerCase() === name.toLowerCase()
    );

  return filteredData.slice(0, limit);
};

export default function CommandFilteringApp() {
  const [command, setCommand] = useState('');
  const [results, setResults] = useState(sampleData);

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    const filtered = parseCommand(command, sampleData);
    setResults(filtered);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Command-Based Data Filtering</h1>
      <form onSubmit={handleCommandSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Enter command (e.g., 'Give me 3 users from Dortmund older than 30')"
          className="w-full p-2 border rounded-lg"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Filter Data
        </button>
      </form>
      <div className="mt-6 space-y-2">
        {results.length ? (
          results.map((user) => (
            <div
              key={user.id}
              className="p-4 border rounded-lg shadow-sm bg-white"
            >
              <p className="font-semibold">{user.name}</p>
              <p>City: {user.city}</p>
              <p>Age: {user.age}</p>
            </div>
          ))
        ) : (
          <p className="text-red-500">No users found matching the command.</p>
        )}
      </div>
    </div>
  );
}
