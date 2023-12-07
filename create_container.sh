# Remove container if exists

docker stop gamegalaxy
docker rm gamegalaxy

# Create the docker container with the cores
docker run -p 8983:8983 --name gamegalaxy -d solr:9.3 solr-precreate games

# Wait for Solr to initialize
sleep 20

# Import stop words file
# docker cp "$PWD"/search-engine/stopwords.txt gamegalaxy:/var/solr/data/games/conf
# Import synonyms file
# docker cp "$PWD"/search-engine/synonyms.txt gamegalaxy:/var/solr/data/games/conf

# Insert schema
curl -X POST -H 'Content-type:application/json' --data-binary "@./search-engine/schema2.json" http://localhost:8983/solr/games/schema

# Populate
curl -X POST -H 'Content-type:application/json' --data-binary "@./search-engine/games_collection_part1.json" http://localhost:8983/solr/games/update?commit=true

curl -X POST -H 'Content-type:application/json' --data-binary "@./search-engine/games_collection_part2.json" http://localhost:8983/solr/games/update?commit=true
