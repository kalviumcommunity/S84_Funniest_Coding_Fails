import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CodingFail from '../components/CodeFailCard';

function Home() {
  const [codingFails, setCodingFails] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCodingFails();
  }, []);

  const fetchCodingFails = () => {
    axios
      .get('http://localhost:3000/api/funniest')
      .then((response) => {
        setCodingFails(response.data);
        setError(null); // Clear error on success
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError('Failed to load coding fails. Please try again later.');
      });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/funniest/${id}`);
      fetchCodingFails(); // Refresh the list after deletion
      setError(null); // Clear error on success
    } catch (err) {
      console.error('Error deleting entity:', err);
      setError('Failed to delete entity. Please try again.');
    }
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
      </header>
      <main className="p-6">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold">About Our Project</h2>
          <p className="mt-4">
            This project is a collection of the funniest and most relatable coding fails. Whether you're a beginner or a seasoned developer, you'll find something to laugh about here.
          </p>
        </section>
        <section>
          <h2 className="text-6xl font-semibold">Funny Coding Fails</h2>
          {error && <p className="text-red-500">{error}</p>}
          {codingFails.length === 0 && !error && (
            <p className="text-gray-500">No coding fails found. Add a new one!</p>
          )}
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {codingFails.map((fail) => (
              <div key={fail._id} className="relative">
                <CodingFail
                  title={fail.name}
                  description={fail.description}
                  author={fail.author}
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Link
                    to={`/update/${fail._id}`}
                    className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(fail._id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export default Home;