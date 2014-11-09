import re

MAP_REPLACE = {
    'a': r'[\xE0-\xE6]',
    'e': r'[\xE8-\xEB]',
    'i': r'[\xEC-\xEF]',
    'o': r'[\xF2-\xF6]',
    'u': r'[\xF9-\xFC]',
    'c': r'\xE7',
    'n': r'\xF1'
}


def search_string(text):
    text = (text and str(text) or '').lower()

    for k, v in MAP_REPLACE.items():
        text = re.sub(v, k, text)

    return text


def obj_search_string(obj, fields):
    return " ".join([search_string(obj[f]) for f in fields])