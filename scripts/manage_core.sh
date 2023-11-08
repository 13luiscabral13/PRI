docker exec gamegalaxy bin/solr delete -c games 

docker exec gamegalaxy bin/solr create_core -c games

# Wait for Solr to initialize
sleep 20

# Insert schema
curl -X POST -H 'Content-type:application/json' --data-binary "@./search-engine/schema1.json" http://localhost:8983/solr/games/schema

# Populate
curl -X POST -H 'Content-type:application/json' --data-binary "@./search-engine/games_collection.json" http://localhost:8983/solr/games/update?commit=true
