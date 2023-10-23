from flask import Flask, request, jsonify
#from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
#CORS(app)

@app.route('/search-barnes-noble/<isbn>')
def search_barnes_noble(isbn):
    try:
        url = f"https://www.barnesandnoble.com/s/{isbn}"
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')

        # Extract book titles, authors, or other relevant information.
        # Example: Searching for book titles.
        results = [result.text for result in soup.find_all('h3', class_='search-title')]

        return jsonify(results)
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
