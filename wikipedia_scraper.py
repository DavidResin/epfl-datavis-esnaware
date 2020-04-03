import wikipediaapi
import json
import requests
import logging

wiki = wikipediaapi.Wikipedia('en')

df_pages = []
index = 0

s = requests.Session()
URL = "https://en.wikipedia.org/w/api.php"

logging.basicConfig(format="%(levelname)s - %(asctime)s: %(message)s", datefmt='%H:%M:%S', level=logging.INFO)

def save_progress():
    print("Saving progress")
    with open("wikipedia_test.json", 'w+', encoding='utf8') as f:
        json.dump(df_pages, f, ensure_ascii=False, indent=4)

def parse_page(title, category):
    print("Page:", title)
    page = wiki.page(title=title)
    df_pages.append({
        'Title': title,
        'Category': category,
        'Links': list(page.links.keys()),
        'Text': page.text
    })

def parse_category(category, index):
    category_split = category.split("Category:")[1]
    print("Category:", category_split, "\n")
    params = {
        "action": "query",
        "cmtitle": category,
        "cmlimit": "max",
        "list": "categorymembers",
        "format": "json"
    }

    r = s.get(url=URL, params=params)
    data = r.json()
    pages = data['query']['categorymembers']
    categories = [page['title'] for page in pages if page['title'].startswith("Category:")]
    pages = [page['title'] for page in pages if page['title'] not in categories]

    for title in pages:
        index += 1
        parse_page(title, category_split)
        if (index % 1000 == 0):
            logging.info(f"{index} pages processed")
            save_progress()
    print("\n")
    for title in categories:
        parse_category(title, index)


parse_category("Category:Global_warming", index)
save_progress()
