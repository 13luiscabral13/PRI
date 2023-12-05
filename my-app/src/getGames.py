import requests
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')


def get(url):
    return requests.get(url).json()['response']['docs']

if __name__ == "__main__":
    # Check if there is at least one command-line argument
    if len(sys.argv) < 2:
        print("Usage: python getGames.py <solr_url>")
        sys.exit(1)

    # Get the Solr URL from the command-line argument
    solr_url = sys.argv[1]

    # Call the get function with the provided Solr URL
    result = get(solr_url)

    # Print the result or handle it as needed
    if result is not None:
        print("Result:", result)
    else:
        print("Failed to retrieve data.")