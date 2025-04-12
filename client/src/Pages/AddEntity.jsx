import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddEntity() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    author: '',
    created_by: '', // Add created_by field
  });
  const [users, setUsers] = useState([]); // State to store users for dropdown
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch users for the dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/users'); // Fetch users from backend
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again.');
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/funniest', formData); // Send formData including created_by
      navigate('/'); // Redirect to the homepage after successful submission
    } catch (err) {
      console.error('Error adding entity:', err);
      setError('Failed to add entity. Please try again.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6">Add a New Coding Fail</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-lg font-medium mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2" htmlFor="author">
            Author
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2" htmlFor="created_by">
            Created By
          </label>
          <select
            id="created_by"
            name="created_by"
            value={formData.created_by}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select a User</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Coding Fail
        </button>
      </form>
    </div>
  );
}

export default AddEntity;