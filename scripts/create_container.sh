# Remove container if exists

docker stop gamegalaxy
docker rm gamegalaxy

# Create the docker container with the cores
docker run -p 8983:8983 --name gamegalaxy -d solr:9.3 solr-precreate games

# Wait for Solr to initialize
sleep 20

# Import synonyms file
docker cp "$PWD"/search-engine/synonyms.txt gamegalaxy:/var/solr/data/games/conf
docker cp "$PWD"/search-engine/stopwords.txt gamegalaxy:/var/solr/data/games/conf

# Insert schema
curl -X POST -H 'Content-type:application/json' --data-binary "@./search-engine/schema2.json" http://localhost:8983/solr/games/schema

# Populate
curl -X POST -H 'Content-type:application/json' --data-binary "@./search-engine/games_collection.json" http://localhost:8983/solr/games/update?commit=true

# Remove automatically created field
curl -X POST -H 'Content-type: application/json' --data '{
  "delete-field": {
    "name": "_nest_path_"
  }
}' http://localhost:8983/solr/games/schema