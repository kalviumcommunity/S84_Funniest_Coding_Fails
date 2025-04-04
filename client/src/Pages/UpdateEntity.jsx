import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function UpdateEntity() {
  const { id } = useParams(); // Get the ID from the URL
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    author: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/funniest/${id}`)
      .then((response) => {
        const { name, description, author } = response.data; // Extract only required fields
        setFormData({ name, description, author });
        setError(null); // Clear error on success
      })
      .catch((err) => {
        console.error('Error fetching entity:', err);
        setError('Failed to load entity data.');
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/funniest/${id}`, formData);
      setError(null); // Clear error on success
      navigate('/'); // Redirect to the homepage after successful update
    } catch (err) {
      console.error('Error updating entity:', err);
      setError('Failed to update entity. Please try again.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6">Update Coding Fail</h1>
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
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Update Coding Fail
        </button>
      </form>
    </div>
  );
}

export default UpdateEntity;