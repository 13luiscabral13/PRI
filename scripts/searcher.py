import webbrowser
from googlesearch import search

query_number = "q1"

base_path = "../queries/" + query_number + "/" + query_number + "_baseRank.txt"
boosted_path = "../queries/" + query_number + "/" + query_number + "_boostedRank.txt"
relevant = "../queries/" + query_number + "/" + query_number + "_relevant.txt"

file_path = boosted_path
numberOfResults = 3

def extract_game_names(file_path):
    try:
        with open(file_path, 'r') as file:
            lines = file.readlines()
            game_names = [line.strip() for line in lines if not line.startswith('\\')]
            game_names = [game.replace('BASE \\\\', '').replace(' \\\\', '') for game in game_names]
            return game_names[1:]
    except Exception as e:
        print(f"Error reading the file '{file_path}': {e}")
        return []

def search_google(query):
    try:
        search_results = list(search(query, advanced=True))
        print(f"URL: {search_results[0].url}\n")
    except Exception as e:
        print(f"Error searching for '{query}': {e}")


def checkRelevance(name):
    if ("boosted" in file_path): 
        with open(relevant, 'r', encoding='UTF-8') as file:
            lines = file.readlines()
            lines = [line.replace('\n', '') for line in lines]
            base_lines = extract_game_names(base_path)
            print(base_lines)
            if (name not in lines and name not in base_lines):
                veredict = input("Is " + name + " relevant for the query? (Y/N)\n")
                if (veredict.lower() == 'n'):
                    return
                else: 
                    with open(relevant, 'a', encoding='UTF-8') as fileW:
                        fileW.write(name + "\n")
                        return
    else:
        veredict = input("Is " + name + " relevant for the query? (Y/N)\n")
        if (veredict.lower() == 'n'):
            return
        else: 
            with open(relevant, 'a', encoding='UTF-8') as fileW:
                fileW.write(name + "\n")
                return
def main(file_path):
    game_names = extract_game_names(file_path)
    print(game_names)
    for game_name in game_names:
        checkRelevance(game_name)

        
main(file_path)
