import pandas as pd
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
import re
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import time

'''
# Set the path to your ChromeDriver executable
chrome_driver_path = r"C:\Users\luisk\OneDrive\Ambiente de Trabalho\Programas\chromedriver-win64\chromedriver.exe"

# Create a Chrome webdriver instance
chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument("--headless")  # Run Chrome in headless mode (no GUI)

# Create a ChromeService instance with the executable path
chrome_service = ChromeService(executable_path=chrome_driver_path)

# Create a Chrome webdriver instance using the service
driver = webdriver.Chrome(service=chrome_service, options=chrome_options)

metacritic_dataset = pd.read_csv('../datasets/all_games.csv')

empty_dataset = pd.DataFrame(columns=metacritic_dataset.columns)


metacritic_dataset['MetacriticReviews'] = None
existantURL = {
    "Back to the Future: The Game - Episode I: It's About Time" : "https://www.metacritic.com/game/back-to-the-future-the-game-episode-i-its-abo/",
    "Bit.Trip Presents...Runner2: Future Legend of Rhythm Alien" : "https://www.metacritic.com/game/bit-trip-presents-runner2-future-legend-of-rhyt/",
    "Tales From The Borderlands: Episode 3 - Catch A Ride" : "https://www.metacritic.com/game/tales-from-the-borderlands-episode-three-catch-a/",
    "Pro Cycling Manager Season 2013: Le Tour de France - 100th Edition": "https://www.metacritic.com/game/pro-cycling-manager-season-2013-le-tour-de-france/",
    "Heroes of Might and Magic: Quest for the Dragon Bone Staff" : "https://www.metacritic.com/game/heroes-of-might-and-magic-quest-for-the-dragon-bo/",
    "Phoenix Wright: Ace Attorney - Trials and Tribulations": "https://www.metacritic.com/game/phoenix-wright-ace-attorney-trials-and/",
    "Kingdoms of Amalur: Reckoning - The Legend of Dead Kel" : "https://www.metacritic.com/game/kingdoms-of-amalur-reckoning-the-legend-of-dead/",
    "Resident Evil: Revelations 2 - Episode 4: Metamorphosis": "https://www.metacritic.com/game/resident-evil-revelations-2-episode-4/",
    "The Lord of the Rings: The Battle for Middle-Earth II": "https://www.metacritic.com/game/the-lord-of-the-rings-the-battle-for-middle-earth-2006/",
    "Final Fantasy Crystal Chronicles: My Life as a Darklord": "https://www.metacritic.com/game/final-fantasy-crystal-chronicles-my-life-as-a-dar/",
    "The Legend of Zelda: Breath of the Wild - The Master Trials": "https://www.metacritic.com/game/the-legend-of-zelda-breath-of-the-wild-the-master/",
    "The Walking Dead: The Telltale Series - The Final Season Episode 1: Done Running": "https://www.metacritic.com/game/the-walking-dead-the-telltale-series-the-final-2018/",
    "The Raven: Legacy of a Master Thief - Ancestry of Lies": "https://www.metacritic.com/game/the-raven-legacy-of-a-master-thief-ancestry-of/",
    "Hearthstone: Heroes of Warcraft - The Grand Tournament" : "https://www.metacritic.com/game/hearthstone-heroes-of-warcraft-the-grand/",
    "Castlevania Requiem: Symphony of the Night & Rondo of Blood": "https://www.metacritic.com/game/castlevania-requiem-symphony-of-the-night-and/",
    "Dragon Quest XI S: Echoes of an Elusive Age - Definitive Edition" : "https://www.metacritic.com/game/dragon-quest-xi-s-echoes-of-an-elusive-age/",
    "Edna & Harvey: The Breakout - 10th Anniversary Edition": "https://www.metacritic.com/game/edna-and-harvey-the-breakout-10th-anniversary/",
    "Sam & Max: The Devil's Playhouse - Episode 2: The Tomb of Sammun-Mak": "https://www.metacritic.com/game/sam-and-max-the-devils-playhouse-episode-2/",
    "Gabriel Knight 3: Blood of the Sacred, Blood of the Damned": "https://www.metacritic.com/game/gabriel-knight-3-blood-of-the-sacred-blood-of-th/",
    "The Chronicles of Narnia: The Lion, The Witch and The Wardrobe": "https://www.metacritic.com/game/the-chronicles-of-narnia-the-lion-the-witch-and/",
    "Area 51": "https://www.metacritic.com/game/area-51-2005/",
    "Constantine": "https://www.metacritic.com/game/constantine-2005/",
    "Perfect Dark": "https://www.metacritic.com/game/perfect-dark-2000/",
    
}



start = time.time()
for index, row in metacritic_dataset.iterrows():
    name = row['name']
    metacritic_url = ""
    if name in existantURL.keys():
        platform = row['platform'].lower().replace(" ", "-").replace(":", "").replace("'", "").replace(".", "").replace("/", "")
        if (platform[0]=='-'):
            platform = platform[1:]
        if (platform=="switch"):
            platform = "nintendo-switch"
        metacritic_url = existantURL[name] + f'critic-reviews/?platform={platform}'
    else:
        name = name.lower().replace(":", "").replace("'", "").replace(".", "").replace("/", "").replace("*", "").replace("(", "").replace(")", "").replace(";", "").replace("&"," and ").replace(",", "").replace("!", "").replace("?", "").replace("-", "").strip()
        name = re.sub(r'\s+', ' ', name)
        name = name.replace(' ', '-')
        platform = row['platform'].lower().replace(" ", "-").replace(":", "").replace("'", "").replace(".", "").replace("/", "")
        if (platform[0]=='-'):
            platform = platform[1:]
        if (platform=="switch"):
            platform = "nintendo-switch"
        metacritic_url = f'https://www.metacritic.com/game/{name}/critic-reviews/?platform={platform}'
            
    print(name, ': ', platform)    
    print(metacritic_url)
    
    # Load the webpage
    driver.get(metacritic_url)

    # Wait for dynamic content to load (you may need to adjust the wait time)
    driver.implicitly_wait(10)  # Wait for up to 10 seconds

    # Extract the content
    page_source = driver.page_source
    
    soup = BeautifulSoup(page_source, 'html.parser')
    
    reviews_list = []
    number = soup.find("div", class_="c-pageProductReviews_text")
    if (number):
        number = number.get_text().split("Showing ")[1]
        number = number.split(" Critic Review")[0]
        number = int(number)
        if (number < 5):
            count_max = number
        else:
            count_max = max(round(number*0.3), 5)
    
        elements = soup.find_all("div", class_="c-siteReview_main g-inner-spacing-medium")

        count = 0
        for element in elements:
            if count==count_max:
                break
            username = element.find("a", class_ = "c-siteReviewHeader_publicationName g-text-bold g-color-gray90")
            review = element.find("div", class_="c-siteReview_quote g-outer-spacing-bottom-small")
            span_element = review.find('span')
            if span_element:
                review_text = span_element.get_text().strip()
                username_text = username.get_text().strip()
                review_pair = (username_text, review_text)
                reviews_list.append(review_pair)
                count = count + 1
                
    print("Success\n")
            
    if not reviews_list:
        # If empty, store the result in empty_dataset
        empty_dataset.at[index, 'name'] = name
        empty_dataset.at[index, 'MetacriticReviews'] = None  # or any placeholder value

    else:
        # Store reviews as a list of tuples in the MetacriticReviews column
        metacritic_dataset.at[index, 'MetacriticReviews'] = reviews_list

# Save the datasets to CSV files
if not empty_dataset.empty:
    empty_dataset.to_csv("empty_rev.csv", index=False)
    
metacritic_dataset.to_csv("../datasets/metacritic_games.csv")    
driver.quit()
'''


no_empty = pd.read_csv('../datasets/metacritic_games.csv')
no_empty.dropna(inplace=True)

no_empty.to_csv("../datasets/no_empty.csv")

