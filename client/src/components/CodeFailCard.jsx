import { useState } from 'react';
import PropTypes from 'prop-types';

function CodingFail({ title, description, codeSnippet, author }) {
  const [likes, setLikes] = useState(0);
  
  const handleLike = () => {
    setLikes(likes + 1);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-10 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      
      {codeSnippet && (
        <div className="bg-gray-800 rounded p-4 my-4 overflow-x-auto">
          <pre className="text-gray-300 text-sm font-mono">{codeSnippet}</pre>
        </div>
      )}
      
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
        
        {author && <span className="text-gray-500 text-sm">Posted by: {author}</span>}
        <button 
          onClick={handleLike}
          className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
        >
          <span role="img" aria-label="heart">❤️</span> {likes}
        </button>
      </div>
    </div>
  );
}

CodingFail.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  codeSnippet: PropTypes.string,
  author: PropTypes.string
};

export default CodingFail;