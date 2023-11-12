import matplotlib.pyplot as plt
from sklearn.metrics import PrecisionRecallDisplay
import numpy as np
import json
import requests
import pandas as pd

QUERY_NUMBER = "q1"
QUERY_PATH = '../queries/' + QUERY_NUMBER + '/' + QUERY_NUMBER

BASE_QUERY_URL = "http://localhost:8983/solr/games/select?fl=*%2C%5Bchild%5D&fq=%7B!child%20of%3D%22*%3A*%20-_nest_path_%3A*%22%7Dtitle%3Aracing%20OR%20summary%3A(racing%20OR%20%22play%20with%20friends%22)%20OR%20wikipedia%3Aracing%20OR%20genre%3Aracing&indent=true&q.op=OR&q=review%3A(awesome%20OR%20%22play%20with%20friends%22%20OR%20friends)&rows=1000&useParams=&wt=json"
BOOSTED_QUERY_URL = "http://localhost:8983/solr/games/select?bq=reviews%3A%22play%20with%20friends%22%5E4%2C%20%20genre%3A%22racing%22%5E4&defType=edismax&fl=*%2C%5Bchild%5D&fq=%7B!child%20of%3D%22*%3A*%20-_nest_path_%3A*%22%7Dtitle%3Aracing%20OR%20summary%3A(racing%20OR%20%22play%20with%20friends%22)%20OR%20wikipedia%3Aracing%20OR%20genre%3Aracing&indent=true&q.op=OR&q=review%3A(awesome%20OR%20%22play%20with%20friends%22%20OR%20friends)&rows=1000&useParams=&wt=json"

#Query retorna reviews
base_results = requests.get(BASE_QUERY_URL).json()['response']['docs']
base_gameids = []

for index, doc in enumerate(base_results):
    if len(base_gameids) == 10:
        break
    
    if doc['id'] not in base_gameids:
        base_gameids.append(doc['id'].split('/')[0])

id_string = 'id%3A(' + '%20OR%20'.join(map(str, base_gameids)) + ')&useParams=&wt=json'
BASE_QUERY_URL = "http://localhost:8983/solr/games/select?fl=*%2C%5Bchild%5D&indent=true&q.op=OR&q=" + id_string

print(BASE_QUERY_URL)

#Query retorna reviews
boosted_results = requests.get(BOOSTED_QUERY_URL).json()['response']['docs']
boosted_gameids = []

for index, doc in enumerate(boosted_results):
    if len(boosted_gameids) == 10:
        break
    
    if doc['id'] not in boosted_gameids:
        boosted_gameids.append(doc['id'].split('/')[0])

id_string = 'id%3A(' + '%20OR%20'.join(map(str, boosted_gameids)) + ')&useParams=&wt=json'
BOOSTED_QUERY_URL = "http://localhost:8983/solr/games/select?fl=*%2C%5Bchild%5D&indent=true&q.op=OR&q=" + id_string

print(BOOSTED_QUERY_URL)


base_results = requests.get(BASE_QUERY_URL).json()['response']['docs']
base_ranked_doc = [doc['title'] for index, doc in enumerate(base_results)]
df_base = pd.DataFrame(base_ranked_doc, columns=['BASE'], index=None)

print(df_base)

latex_table = df_base.to_latex(index=False)

with open(QUERY_PATH+'_baseRank.txt', 'w') as tf:
    tf.write(latex_table)

boosted_results = requests.get(BOOSTED_QUERY_URL).json()['response']['docs']
boosted_ranked_doc = [doc['title'] for index, doc in enumerate(boosted_results)]

df_boosted = pd.DataFrame(boosted_ranked_doc, columns=['BOOSTED'], index=None)

print(df_boosted)

latex_table = df_boosted.to_latex(index=False)

with open(QUERY_PATH+'_boostedRank.txt', 'w') as tf:
    tf.write(latex_table)
