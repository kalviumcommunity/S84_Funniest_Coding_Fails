import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function UpdateEntity() {
  const { id } = useParams(); // Get the entity ID from the URL
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    author: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [isSubmitting, setIsSubmitting] = useState(false); // Add submitting state
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true); // Start loading
    setError(null); // Clear previous errors
    axios
      .get(`http://localhost:3000/api/entities/${id}`) // Fetch the specific entity
      .then((response) => {
        const { name, description, author } = response.data;
        // Ensure author is not null/undefined before setting state
        setFormData({ name, description, author: author || "" });
      })
      .catch((err) => {
        console.error(
          "Error fetching entity:",
          err.response?.data || err.message
        );
        if (err.response?.status === 404) {
          setError(
            "Entity not found. It might have been deleted or the ID is incorrect."
          );
        } else {
          setError(
            "Failed to load entity data. Please check the console and ensure the backend is running."
          );
        }
      })
      .finally(() => {
        setIsLoading(false); // Stop loading regardless of success or failure
      });
  }, [id]); // Re-fetch if the ID changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.name || !formData.description) {
      setError("Name and Description are required.");
      return;
    }
    setIsSubmitting(true); // Disable button
    setError(null); // Clear previous errors

    try {
      // Send only the fields that can be updated
      const updateData = {
        name: formData.name,
        description: formData.description,
        // Set author to 'Anonymous' if left blank, otherwise use the input value
        author: formData.author.trim() === "" ? "Anonymous" : formData.author,
      };
      await axios.put(`http://localhost:3000/api/entities/${id}`, updateData);
      navigate("/"); // Redirect on success
    } catch (err) {
      console.error(
        "Error updating entity:",
        err.response?.data || err.message
      );
      // Display specific backend errors if available
      if (err.response?.data?.error) {
        setError(`Error: ${err.response.data.error}`);
      } else {
        setError(
          "Failed to update entity. Please check the console and try again."
        );
      }
    } finally {
      setIsSubmitting(false); // Re-enable button
    }
  };

  // Display loading message
  if (isLoading) {
    return (
      <div className="p-6 text-center text-xl">Loading entity data...</div>
    );
  }

  // Display error message if loading failed and no form data is available
  if (error && !formData.name && !isLoading) {
    // Check isLoading to prevent showing this during initial load fail
    return (
      <div className="p-6 max-w-lg mx-auto text-center">
        <p className="text-red-500 mb-4 bg-red-100 p-3 rounded">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Back to Home
        </button>
      </div>
    );
  }

  // Render the form once loading is complete (even if there was a fetch error but we have some data)
  return (
    <div className="p-6 max-w-lg mx-auto">
      {" "}
      {/* Added max-width and centering */}
      <h1 className="text-3xl font-bold mb-6">Update Coding Fail (ID: {id})</h1>
      {/* Display error message above the form if an update fails */}
      {error && (
        <p className="text-red-500 mb-4 bg-red-100 p-3 rounded">{error}</p>
      )}
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
            disabled={isLoading} // Disable form fields while loading initial data
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
            rows="4" // Added rows for better text area size
            required
            disabled={isLoading} // Disable form fields while loading initial data
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-1" htmlFor="author">
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
            disabled={isLoading} // Disable form fields while loading initial data
          />
        </div>
        <button
          type="submit"
          className={`w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
            isSubmitting || isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isSubmitting || isLoading} // Disable button while submitting or initial loading
        >
          {isSubmitting ? "Updating..." : "Update Coding Fail"}
        </button>
      </form>
      {/* Add a cancel button */}
      <button
        onClick={() => navigate("/")}
        className={`mt-4 w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isSubmitting} // Also disable cancel during submit
      >
        Cancel
      </button>
    </div>
  );
}

export default UpdateEntity;
