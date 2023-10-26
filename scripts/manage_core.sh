docker exec gamegalaxy bin/solr delete -c games 

docker exec gamegalaxy bin/solr create_core -c games

# Insert schema
curl -X POST -H 'Content-type:application/json'  \
--data-binary "@./schema1.json"  \
http://localhost:8983/solr/games/schema

# Populate
curl -X POST -H 'Content-type:application/json' \
--data-binary "@./games_collection.json" \ 
http://localhost:8983/solr/games/update?commit=true
