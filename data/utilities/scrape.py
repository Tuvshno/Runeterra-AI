import requests
from bs4 import BeautifulSoup
import os

# Base URL of the page to scrape, without the champion name
base_url = "https://leagueoflegends.fandom.com/wiki/{}/LoL"
# base_url = "https://leagueoflegends.fandom.com/wiki/{}"

# Path to the champion list
champion_list_path = '../documents/champ_list.txt'

# Read the champion names from the file
with open(champion_list_path, 'r', encoding='utf-8') as file:
    champion_names = file.read().splitlines()

for champion_name in champion_names:
    # Format the champion name URL part
    champion_url = base_url.format(champion_name.replace(" ", "_"))

    # Fetch the page
    response = requests.get(champion_url)
    if response.status_code == 200:
        # Parse the HTML content
        soup = BeautifulSoup(response.text, 'html.parser')
        content_div = soup.find('div', id='content')

        if content_div:
            processed_content = content_div.get_text(separator='\n', strip=True)

            # Define the directory and file path
            champion_dir = f"../documents/Champion Information/{champion_name}"
            file_path = os.path.join(champion_dir, f"{champion_name}.txt")

            # Create the directory if it does not exist
            os.makedirs(champion_dir, exist_ok=True)

            # Save the processed content to a text file
            with open(file_path, "w", encoding="utf-8") as file:
                file.write(processed_content)
            print(f"Data saved for {champion_name}")
        else:
            print(f"Content division not found for {champion_name}")
    else:
        print(f"Failed to fetch page for {champion_name}")
