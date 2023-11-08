# Remove container if exists

docker stop gamegalaxy
docker rm gamegalaxy

# Create the docker container with the cores
docker run -p 8983:8983 --name gamegalaxy -v data -d solr:9.3 solr-precreate games

# Wait for Solr to initialize
sleep 20

# Insert schema
curl -X POST -H 'Content-type:application/json' --data-binary "@./search-engine/schema1.json" http://localhost:8983/solr/games/schema

# Populate
curl -X POST -H 'Content-type:application/json' --data-binary "@./search-engine/games_collection.json" http://localhost:8983/solr/games/update?commit=true
