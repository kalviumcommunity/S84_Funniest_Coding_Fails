import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CodingFail from '../components/CodeFailCard';

function Home() {
  const [codingFails, setCodingFails] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/funniest') // Fetch data from backend
      .then((response) => {
        setCodingFails(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError('Failed to load coding fails. Please try again later.');
      });
  }, []);

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
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {codingFails.map((fail, index) => (
              <CodingFail
                key={index}
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