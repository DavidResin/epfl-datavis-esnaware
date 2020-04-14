import wikipediaapi
import json
import requests

# Maximal depth of the tree we're constructing
MAX_DEPTH = 12

wiki = wikipediaapi.Wikipedia('en')

df_pages = []
index = 0
category_set = set()

s = requests.Session()
URL = "https://en.wikipedia.org/w/api.php"


def save_progress():
    """
    Save the data into a JSON file
    """
    print("Saving progress")
    with open(f"data/wikipedia_depth_{MAX_DEPTH}.json", 'w+', encoding='utf8') as f:
        json.dump(df_pages, f, ensure_ascii=False, indent=4)


def parse_page(title, categories_list):
    """
    Given a title, parse the page with this title and
    add the entry to the dictionary
    :param title: (str)
        Title of the Wikipedia page
    :param categories_list:
        List of categories and subcategories
        the page belongs to
    """
    print("Page:", title)
    page = wiki.page(title=title)
    df_pages.append({
        'Title': title,
        'Category': categories_list,
        'Links': list(page.links.keys()),
        'Text': page.text
    })


def parse_category(category, categories_list, index):
    """
    Recursive algorithm that, given a category to parse and
    the list of already parsed categories in the subbranch,
    parses the pages and subcategories until a certain MAX_DEPTH
    :param category: (str)
        Category to parse
    :param categories_list: (list)
        List of already parsed categories in the subbranch leading
        to the category 'category'
    :param index:
        Index indicating the number of parsed pages
    :return:
    """
    category_split = category.split("Category:")[1]
    categories_chain = categories_list + [category_split]

    print("Category:", category_split)
    print(categories_chain, "\n")

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
        parse_page(title, categories_chain)
        if (index % 1000 == 0):
            print(f"{index} pages processed")
            save_progress()
    print("\n")
    for title in categories:
        if len(categories_chain) < MAX_DEPTH and title not in category_set:
            category_set.add(title)
            parse_category(title, categories_chain, index)


parse_category("Category:Global_warming", [], index)
save_progress()
