import pandas as pd
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService

# Set the path to your ChromeDriver executable
chrome_driver_path = r"C:\Users\barba\Downloads\chromedriver-win64\chromedriver-win64\chromedriver.exe"

# Create a Chrome webdriver instance
chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument("--headless")  # Run Chrome in headless mode (no GUI)

# Create a ChromeService instance with the executable path
chrome_service = ChromeService(executable_path=chrome_driver_path)

# Create a Chrome webdriver instance using the service
driver = webdriver.Chrome(service=chrome_service, options=chrome_options)

metacritic_dataset = pd.read_csv('games_sample.csv')

metacritic_dataset['MetacriticReviews'] = None

for index, row in metacritic_dataset.iterrows():    
    name = row['Title'].lower().replace(" ", "-").replace(":", "").replace("'", "")
    platform = row['platform'].lower().replace(" ", "-").replace(":", "").replace("'", "")
    if (platform=="switch"):
        platform = "nintendo-switch"
    print(name, ': ', platform)
    
    metacritic_url = f'https://www.metacritic.com/game/{name}/critic-reviews/?platform={platform}'
    
    print(metacritic_url)
    
    # Load the webpage
    driver.get(metacritic_url)

    # Wait for dynamic content to load (you may need to adjust the wait time)
    driver.implicitly_wait(10)  # Wait for up to 10 seconds

    # Extract the content
    page_source = driver.page_source
    
    soup = BeautifulSoup(page_source, 'html.parser')
    
    number = soup.find("div", class_="c-pageProductReviews_text")
    if (number):
        number = number.get_text().split("Showing ")[1]
        number = number.split(" Critic Reviews")[0]
        number = int(number)
        if (number < 5):
            count_max = number
        else:
            count_max = max(round(number*0.3), 5)
    
        elements = soup.find_all("div", class_="c-siteReview_main g-inner-spacing-medium")
        reviews_list = []

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
            
    # Store reviews as list of tuples in the MetacriticReviews column
    metacritic_dataset.at[index, 'MetacriticReviews'] = reviews_list
    
metacritic_dataset.to_csv("metacritic_games.csv")    
driver.quit()
        


