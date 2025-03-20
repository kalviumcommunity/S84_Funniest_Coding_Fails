import { useEffect, useState } from 'react';
import axios from 'axios';
import CodingFail from '../components/CodeFailCard';

function Home() {
  const [codingFails, setCodingFails] = useState([
    // Dummy data to test the component
    {
      id: 1,
      title: "The Infinite Loop Disaster",
      description: "I spent 3 hours debugging why my server kept crashing, only to find I had a 'while(true)' with no break condition.",
      codeSnippet: "while (true) {\n  console.log('Processing...');\n  // Forgot the break condition!\n}",
      author: "Akanskharajpooot"
    },
    {
      id: 2,
      title: "The Case of the Missing Semicolon",
      description: "Spent an entire day tracking down a bug that was caused by a missing semicolon in JavaScript.",
      codeSnippet: "function getData() {\n  let x = 10\n  return x\n}",
      author: "Akankshaparmar"
    },
    {
      id: 3,
      title: "CSS Chaos",
      description: "Tried to center a div and accidentally made the entire website rotate 180 degrees.",
      codeSnippet: ".container {\n  display: flex;\n  justify-content: center;\n  transform: rotate(180deg); /* Oops */\n}",
      author: "nainaan"
    }
  ]); // Use State Hook

  useEffect(() => {
    axios.get('http://localhost:5000/coding-fails')
      .then(response => {
        setCodingFails(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []); // Use Effect Hook

  return (
    <>
      <header className="bg-red-600 text-blue p-10">
        <h1 className="text-6xl font-bold">Welcome to S84 Funniest Coding Fails</h1>
        <p className="mt-2">Your go-to place for hilarious coding moments!</p>
      </header>
      <main className="p-6">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold">About Our Project</h2>
          <p className="mt-4">
            This project is a collection of the funniest and most relatable coding fails. Whether you're a beginner or a seasoned developer, you'll find something to laugh about here.
          </p>
          <h3>YONO</h3>
        </section>
        <section>
          <h2 className="text-6xl font-semibold">Funny Coding Fails</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {codingFails.map((fail, index) => (
              <CodingFail key={index} title={fail.title} description={fail.description} author={fail.author}/>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export default Home;
