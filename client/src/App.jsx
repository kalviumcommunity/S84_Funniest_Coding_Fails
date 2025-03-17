
import './App.css';
import CodingFail from "./CodingFail";
import { useEffect,useState } from 'react';
import axios from 'axios';


function App() {
  const [codingFails,setCodingFails]=useState([]);
  useEffect(()=>{
    axios.get('http://localhost:5000/coding-fails')
    .then(response =>{
      setCodingFails(response.data);

    })
    .catch(error=>{
      console.error('Error fetching data:',error);

    });
  },[]);

  return (
    <>
      <header>
        <h1>Welcome to S84 Funniest Coding Fails</h1>
        <p>Your go-to place for hilarious coding moments!</p>
      </header>
      <main>
        <section>
          <h2>About Our Project</h2>
          <p>
            This project is a collection of the funniest and most relatable coding fails. Whether you're a beginner or a seasoned developer, you'll find something to laugh about here.
          </p>
        </section>
        <section>
          <h2>Funny Coding Fails</h2>
          {codingFails.map((fail, index) => (
            <CodingFail key={index} title={fail.title} description={fail.description} />
          ))}
        </section>
      </main>
    </>
  );
}

export default App;