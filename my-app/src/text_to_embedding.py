from flask import Flask, jsonify, request
from sentence_transformers import SentenceTransformer

app = Flask(__name__)

@app.route('/api/text_to_embedding', methods=['POST'])
def text_to_embedding():
    data = request.get_json()
    text = data.get('text', '')

    model = SentenceTransformer('all-MiniLM-L6-v2')
    embedding = model.encode(text, convert_to_tensor=False).tolist()
    
    # Convert the embedding to the expected format
    embedding_str = "[" + ",".join(map(str, embedding)) + "]"
    return jsonify({'result': embedding_str})

if __name__ == '__main__':
    app.run(debug=True)