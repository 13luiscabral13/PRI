import requests
from sentence_transformers import SentenceTransformer

def text_to_embedding(text):
    model = SentenceTransformer('all-MiniLM-L6-v2')
    embedding = model.encode(text, convert_to_tensor=False).tolist()
    
    # Convert the embedding to the expected format
    embedding_str = "[" + ",".join(map(str, embedding)) + "]"
    return embedding_str

def solr_query(endpoint, collection, embedding, query_text):
    url = f"{endpoint}/{collection}/select"
    
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    
    # Perform soft search
    soft_search_data = {
        "q": f"{{!knn f=vector topK=30}}{embedding}",
        "fl": "*",
        "rows": 30,
        "wt": "json"
    }

    response_soft_search = requests.post(url, data=soft_search_data, headers=headers)
    response_soft_search.raise_for_status()

    # Save IDs of soft search 
    soft_search_results = response_soft_search.json()
    soft_search_doc_ids = [doc['id'] for doc in soft_search_results['response']['docs']]


    # Perform hard search
    hard_search_data = {
        "bq": "{!child of=\"*:* -_nest_path_:*\"}",
        "bqName": f"name:({query_text})^2",
        "bqSummary": f"summary:({query_text})",
        "bqWikipedia": f"wikipedia:({query_text})^2",
        "bqGenre": f"genre:({query_text})^3",
        "defType": "edismax",
        "fl": "*,[child]",
        "fq": "{!child of=\"*:* -_nest_path_:*\"}name:*",
        "indent": "true",
        "q.op": "OR",
        "q": f"({query_text})",
        "qf": "platform^8 review^2",
        "rows": 30,   #TODO: confirm
        "useParams": "",
        "wt": "json"
    }

    response_hard_search = requests.post(url, data=hard_search_data, headers=headers)
    response_hard_search.raise_for_status()
    
    # Save IDs of hard search 
    hard_search_results = response_hard_search.json()
    hard_search_doc_ids = [doc['id'].split('/')[0] for doc in hard_search_results['response']['docs']]
    
    
    # Perform final query to get documents returned on both stages 
    intersected_doc_ids = set(soft_search_doc_ids) & set(hard_search_doc_ids)
    
    final_query_data = {
        "q": "id:(" + " OR ".join(intersected_doc_ids) + ")",
        "fl":  "*,[child]",
        "rows": len(intersected_doc_ids),
        "wt": "json"
    }
    
    response_final_search = requests.post(url, data=final_query_data, headers=headers)
    response_final_search.raise_for_status()
    
    # Return the final intersected results
    return response_final_search.json()


def display_results(results):
    docs = results.get("response", {}).get("docs", [])
    if not docs:
        print("No results found.")
        return

    for doc in docs:
        print(f"* {doc.get('id')} {doc.get('name')}")

def main():
    solr_endpoint = "http://localhost:8983/solr"
    collection = "games"
    
    query_text = input("Enter your query: ")
    embedding = text_to_embedding(query_text)

    try:
        results = solr_query(solr_endpoint, collection, embedding, query_text)
        display_results(results)
    except requests.HTTPError as e:
        print(f"Error {e.response.status_code}: {e.response.text}")

if __name__ == "__main__":
    main()
