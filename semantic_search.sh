# Remove container if exists
docker stop semantic_gamegalaxy
docker rm semantic_gamegalaxy

# Create the docker container with the cores
cat ./search-engine/games_collection.json | python3 ./scripts/get_embeddings.py > ./search-engine/semantic_games.json

# Wait for Solr to initialize
sleep 20

# Insert schema
curl -X POST -H 'Content-type:application/json' --data-binary "@./search-engine/semantic_schema.json" http://localhost:8983/solr/semantic_games/schema

# Populate
 curl -X POST -H 'Content-type:application/json' --data-binary "@./search-engine/semantic_games.json" http://localhost:8983/solr/semantic_games/update?commit=true

# Semantic querying with Dense Vector Embeddings
python3 ./scripts/query_embedding.py