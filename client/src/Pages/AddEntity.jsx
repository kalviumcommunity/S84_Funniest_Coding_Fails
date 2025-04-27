import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddEntity() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    author: "",
    created_by: "", // This will hold the selected user ID
  });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Add submitting state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/users");
        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Please ensure the backend is running.");
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
    // Basic validation
    if (!formData.name || !formData.description || !formData.created_by) {
      setError("Name, Description, and Created By user are required.");
      return;
    }
    setIsSubmitting(true); // Disable button
    setError(null); // Clear previous errors

    try {
      await axios.post("http://localhost:3000/api/entities", {
        ...formData,
        author: formData.author || "Anonymous", // Set default author if empty
      });
      navigate("/"); // Redirect on success
    } catch (err) {
      console.error(
        "Error creating entity:",
        err.response?.data || err.message
      );
      // Display specific backend validation errors if available
      if (err.response?.data?.errors) {
        setError(
          `Validation failed: ${err.response.data.errors
            .map((e) => e.msg)
            .join(", ")}`
        );
      } else if (err.response?.data?.error) {
        setError(`Error: ${err.response.data.error}`);
      } else {
        setError(
          "Failed to create entity. Please check the console and ensure the backend is running correctly."
        );
      }
    } finally {
      setIsSubmitting(false); // Re-enable button
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      {" "}
      {/* Added max-width and centering */}
      <h1 className="text-3xl font-bold mb-6">Add a New Coding Fail</h1>
      {error && (
        <p className="text-red-500 mb-4 bg-red-100 p-3 rounded">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-lg font-medium mb-1" htmlFor="name">
            Name *
          </label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Infinite Loop Mishap"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label
            className="block text-lg font-medium mb-1"
            htmlFor="description"
          >
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the funny coding fail..."
            className="w-full p-2 border border-gray-300 rounded"
            rows="4" // Added rows for better text area size
            required
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-1" htmlFor="author">
            Author (Optional)
          </label>
          <input
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Your name or leave blank for Anonymous"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label
            className="block text-lg font-medium mb-1"
            htmlFor="created_by"
          >
            Created By *
          </label>
          <select
            id="created_by"
            name="created_by"
            value={formData.created_by}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">-- Select the User --</option>
            {/* Use user.id for MySQL keys */}
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email}) {/* Show email for clarity */}
              </option>
            ))}
          </select>
          {users.length === 0 && !error && (
            <p className="text-sm text-gray-500 mt-1">Loading users...</p>
          )}
        </div>
        <button
          type="submit"
          className={`w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isSubmitting} // Disable button while submitting
        >
          {isSubmitting ? "Adding..." : "Add Coding Fail"}
        </button>
      </form>
    </div>
  );
}

export default AddEntity;
