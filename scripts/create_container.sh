# Remove container if exists

docker stop gamegalaxy
docker rm gamegalaxy

# Create the docker container with the cores
docker run -p 8983:8983 --name gamegalaxy -v data -d solr:9.3 solr-precreate games

# Insert schema
curl -X POST -H 'Content-type:application/json'  \
--data-binary "@./schema1.json"  \
http://localhost:8983/solr/games/schema

# Populate
curl -X POST -H 'Content-type:application/json' \
--data-binary "@./games_collection.json" \ 
http://localhost:8983/solr/games/update?commit=true
