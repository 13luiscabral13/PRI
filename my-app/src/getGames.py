import requests
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')


def get(url):
    reviews = requests.get(url).json()['response']['docs']

    #print("Reviews: ", reviews)

    gameids = []
    games = []

    for index, doc in enumerate(reviews):
        if len(gameids) == 0:
            break

        if doc['id'].split('/')[0] not in gameids:
            #print("\nGetting game with id: ", doc['id'].split('/')[0])
            gameids.append(doc['id'].split('/')[0])
            query_url = "http://localhost:8983/solr/games/select?fl=*%2C%5Bchild%5D&indent=true&q.op=OR&q=id%3A(" + doc['id'].split('/')[0] + ')&useParams=&wt=json'
            game_result = requests.get(query_url).json()['response']['docs']
            #print('\n' + game_result)
            games.append(game_result[0])
    return games

