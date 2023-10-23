import React, { useState } from 'react';

function BookSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isbn, setIsbn] = useState('');

  const handleSearch = async () => {
    try {
      const apiKey = ''; // Replace with your actual API key

      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&key=${apiKey}`
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      const books = responseData.items || [];

      if (books.length === 0) {
        alert('No books found for the given search term');
        return;
      }

      // Extract ISBNs
      const isbnArray = books[0].volumeInfo.industryIdentifiers
        .filter((identifier) => identifier.type === 'ISBN_13' || identifier.type === 'ISBN_10')
        .map((isbnObject) => isbnObject.identifier);

      if (isbnArray.length === 0) {
        console.log('ISBNs not found in the response');
      } else {
        setIsbn(isbnArray.join(', ')); // Store the ISBNs in state
        console.log('ISBNs:', isbnArray); // Log the ISBNs to the console

        // Search for the first ISBN in Barnes & Noble
        const firstIsbn = isbnArray[0];
        searchBarnesNoble(firstIsbn);
      }

      setSearchResults(books);
    } catch (error) {
      console.error(error);
    }
  };

  const searchBarnesNoble = async (isbn) => {
    try {
      await fetch(`/search-barnes-noble/${isbn}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search for books"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <div>
        <h2>Search Results on Barnes & Noble:</h2>
        <p>ISBNs: {isbn}</p>
        <ul>
          {searchResults.map((result, index) => (
            <li key={index}>{result.volumeInfo.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default BookSearch;
