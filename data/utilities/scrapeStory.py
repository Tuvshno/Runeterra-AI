from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.firefox import GeckoDriverManager
import time
import os

# Setup Selenium WebDriver for Firefox
driver = webdriver.Firefox()

base_url = "https://universe.leagueoflegends.com/en_US/story/{champion}-color-story/"
champion_list_path = '../documents/champ_list.txt'

with open(champion_list_path, 'r', encoding='utf-8') as file:
    champion_names = file.read().splitlines()

for champion_name in champion_names:
    formatted_name = champion_name.replace(" ", "_")
    champion_url = base_url.format(champion=formatted_name)
    driver.get(champion_url)

    # Scroll to the bottom of the page
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    time.sleep(1)  # Short delay to allow page content to load

    try:
        wait = WebDriverWait(driver, 10)
        content_element = wait.until(EC.presence_of_element_located((By.ID, 'CatchElement')))
        
        paragraphs = content_element.find_elements(By.TAG_NAME, 'p')
        content = "\n".join([p.text for p in paragraphs])

        if content:
            champion_dir = f"../documents/Champion Lore/{champion_name}"
            file_path = os.path.join(champion_dir, f"{champion_name} Story.txt")
            os.makedirs(champion_dir, exist_ok=True)
            with open(file_path, "w", encoding='utf-8') as file:
                file.write(content)
            print(f"Data saved for {champion_name}")
        else:
            print(f"No content found for {champion_name}, skipping.")
    except Exception as e:
        print(f"No content or unable to retrieve content for {champion_name}: {e}")
        continue  # Move on to the next champion if there's an error or no content

driver.quit()
