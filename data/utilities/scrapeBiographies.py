from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.firefox import GeckoDriverManager
import time
import os

# Setup Selenium WebDriver for Firefox
driver = webdriver.Firefox()

# base_url = "https://universe.leagueoflegends.com/en_US/story/champion/{}/"

champion_list_path = '../documents/champ_list.txt'

with open(champion_list_path, 'r', encoding='utf-8') as file:
    champion_names = file.read().splitlines()

for champion_name in champion_names:
    champion_url = base_url.format(champion_name.replace(" ", "_"))
    driver.get(champion_url)

    # Scroll to the bottom of the page
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

    # Wait for the page to load
    time.sleep(1)  # Adjust the sleep time as necessary based on your network speed

    wait = WebDriverWait(driver, 10)  # Adjust time as necessary

    try:
        # Wait until the element is loaded
        content_element = wait.until(EC.presence_of_element_located((By.ID, 'CatchElement')))
        
        # Instead of just getting text, get all child elements' text
        paragraphs = content_element.find_elements(By.TAG_NAME, 'p')
        content = "\n".join([p.text for p in paragraphs])
        
        champion_dir = f"../documents/Champion Lore/{champion_name}"
        file_path = os.path.join(champion_dir, f"{champion_name} Biography.txt")
        os.makedirs(champion_dir, exist_ok=True)
        with open(file_path, "w", encoding='utf-8') as file:
            file.write(content)
        print(f"Data saved for {champion_name}")
    except Exception as e:
        print(f"Error retrieving content for {champion_name}: {e}")

driver.quit()
