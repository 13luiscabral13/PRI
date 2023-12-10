# Remove container if exists

docker stop gamegalaxy
docker rm gamegalaxy

# Create the docker container with the cores
docker run -p 8983:8983 --name gamegalaxy -d solr:9.3 solr-precreate games

# Wait for Solr to initialize
sleep 20

# Import stop words file
 docker cp "$PWD"/stopwords.txt gamegalaxy:/var/solr/data/games/conf
# Import synonyms file
docker cp "$PWD"/search-engine/synonyms.txt gamegalaxy:/var/solr/data/games/conf
# Import config
docker cp "$PWD"/search-engine/solrconfig.xml gamegalaxy:/var/solr/data/games/conf

# Insert schema
curl -X POST -H 'Content-type:application/json' --data-binary "@./improved_schema.json" http://localhost:8983/solr/games/schema

# Populate
curl -X POST -H 'Content-type:application/json' --data-binary "@./search-engine/games_collection_part1.json" http://localhost:8983/solr/games/update?commit=true
curl -X POST -H 'Content-type:application/json' --data-binary "@./search-engine/games_collection_part2.json" http://localhost:8983/solr/games/update?commit=true
curl -X POST -H 'Content-type:application/json' --data-binary "@./search-engine/games_collection_part3.json" http://localhost:8983/solr/games/update?commit=true
curl -X POST -H 'Content-type:application/json' --data-binary "@./search-engine/games_collection_part4.json" http://localhost:8983/solr/games/update?commit=true

# Add more like this handler
curl -X POST -H 'Content-type:application/json' \
    --data-binary "{ \"add-requesthandler\" : { 
        \"name\": \"/mlt\", 
        \"class\": \"solr.MoreLikeThisHandler\", 
        \"defaults\": {\"mlt.fl\": \"title\"} 
    }
}" http://localhost:8983/solr/games/config
