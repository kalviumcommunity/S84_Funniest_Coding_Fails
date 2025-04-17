import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CodingFail from '../components/CodeFailCard';

function Home() {
  const [codingFails, setCodingFails] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchCodingFails();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchCodingFails = async (userId) => {
    try {
      const url = userId
        ? `http://localhost:3000/api/funniest/user/${userId}`
        : 'http://localhost:3000/api/funniest';
      const response = await axios.get(url);
      setCodingFails(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load coding fails. Please try again later.');
    }
  };

  const handleUserChange = (e) => {
    const userId = e.target.value;
    setSelectedUser(userId);
    fetchCodingFails(userId);
  };

  return (
    <>
      <header className="bg-red-600 text-blue p-10">
        <h1 className="text-6xl font-bold">Welcome to S84 Funniest Coding Fails</h1>
        <p className="mt-2">Your go-to place for hilarious coding moments!</p>
        <Link
          to="/add"
          className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add a New Coding Fail
        </Link>
        <div className="mt-4">
          <label htmlFor="userFilter" className="block text-lg font-medium mb-2">
            Filter by User:
          </label>
          <select
            id="userFilter"
            value={selectedUser}
            onChange={handleUserChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">All Users</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </header>
      <main className="p-6">
        <section>
          <h2 className="text-6xl font-semibold">Funny Coding Fails</h2>
          {error && <p className="text-red-500">{error}</p>}
          {codingFails.length === 0 && !error && (
            <p className="text-gray-500">No coding fails found. Add a new one!</p>
          )}
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {codingFails.map((fail) => (
              <CodingFail
                key={fail._id}
                title={fail.name}
                description={fail.description}
                author={fail.author}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export default Home;