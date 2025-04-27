import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function UpdateEntity() {
  const { id } = useParams(); // Get the entity ID from the URL
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    author: "",
    // created_by is usually not updated, but you might want to display it
  });
  const [originalAuthor, setOriginalAuthor] = useState(""); // Store original author if needed
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`http://localhost:3000/api/entities/${id}`) // Fetch the specific entity
      .then((response) => {
        const { name, description, author } = response.data;
        setFormData({ name, description, author: author || "" }); // Ensure author is not null
        setOriginalAuthor(author || ""); // Store original author
        setError(null);
      })
      .catch((err) => {
        console.error(
          "Error fetching entity:",
          err.response?.data || err.message
        );
        setError(
          "Failed to load entity data. It might have been deleted or the ID is incorrect."
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]); // Re-fetch if the ID changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description) {
      setError("Name and Description are required.");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      // Send only the fields that can be updated
      const updateData = {
        name: formData.name,
        description: formData.description,
        author: formData.author || "Anonymous", // Use original if current is empty, or set default
      };
      await axios.put(`http://localhost:3000/api/entities/${id}`, updateData);
      navigate("/"); // Redirect on success
    } catch (err) {
      console.error(
        "Error updating entity:",
        err.response?.data || err.message
      );
      if (err.response?.data?.error) {
        setError(`Error: ${err.response.data.error}`);
      } else {
        setError("Failed to update entity. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading entity data...</div>;
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6">Update Coding Fail (ID: {id})</h1>
      {error && (
        <p className="text-red-500 mb-4 bg-red-100 p-3 rounded">{error}</p>
      )}
      {!error &&
        !isLoading && ( // Render form only if no error and not loading
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-lg font-medium mb-1" htmlFor="name">
                Name *
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
                className="w-full p-2 border border-gray-300 rounded"
                rows="4"
                required
              />
            </div>
            <div>
              <label
                className="block text-lg font-medium mb-1"
                htmlFor="author"
              >
                Author
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Leave blank for Anonymous"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <button
              type="submit"
              className={`w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Coding Fail"}
            </button>
          </form>
        )}
      <button
        onClick={() => navigate("/")} // Add a back button
        className="mt-4 w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        Cancel
      </button>
    </div>
  );
}

export default UpdateEntity;
