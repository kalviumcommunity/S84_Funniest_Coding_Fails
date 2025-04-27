import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import CodingFail from "../components/CodeFailCard"; // Ensure this path is correct

function Home() {
  const [codingFails, setCodingFails] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchCodingFails(); // Fetch all initially
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      // Optionally set an error state for users
    }
  };

  const fetchCodingFails = async (userId) => {
    try {
      // Use /api/entities endpoint
      const url = userId
        ? `http://localhost:3000/api/entities/user/${userId}`
        : "http://localhost:3000/api/entities"; // Fetch all entities
      const response = await axios.get(url);
      setCodingFails(response.data);
      setError(null); // Clear previous errors
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load coding fails. Please try again later.");
      setCodingFails([]); // Clear fails on error
    }
  };

  const handleUserChange = (e) => {
    const userId = e.target.value;
    setSelectedUser(userId);
    fetchCodingFails(userId); // Fetch fails for the selected user (or all if userId is empty)
  };

  return (
    <>
      <header className="bg-red-600 text-white p-10">
        {" "}
        {/* Changed text-blue to text-white for better contrast */}
        <h1 className="text-4xl md:text-6xl font-bold">
          Welcome to S84 Funniest Coding Fails
        </h1>
        <p className="mt-2">Your go-to place for hilarious coding moments!</p>
        <Link
          to="/add"
          className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add a New Coding Fail
        </Link>
        <div className="mt-4 max-w-xs">
          {" "}
          {/* Added max-width for better layout */}
          <label
            htmlFor="userFilter"
            className="block text-lg font-medium mb-2"
          >
            Filter by User:
          </label>
          <select
            id="userFilter"
            value={selectedUser}
            onChange={handleUserChange}
            className="w-full p-2 border border-gray-300 rounded text-black" // Added text-black for readability
          >
            <option value="">All Users</option>
            {/* Use user.id for MySQL keys */}
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </header>
      <main className="p-6">
        <section>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            {" "}
            {/* Adjusted heading size */}
            {selectedUser
              ? `Fails by ${
                  users.find((u) => u.id == selectedUser)?.name ||
                  "Selected User"
                }`
              : "All Funny Coding Fails"}
          </h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {!error && codingFails.length === 0 && (
            <p className="text-gray-500">
              No coding fails found for this selection. Add a new one!
            </p>
          )}
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Use fail.id for MySQL keys */}
            {codingFails.map((fail) => (
              <CodingFail
                key={fail.id}
                title={fail.name}
                description={fail.description}
                // Assuming your CodingFail component can handle author name directly if joined in backend
                author={fail.created_by_name || fail.author || "Unknown"} // Display joined name or fallback
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export default Home;
