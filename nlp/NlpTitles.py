import pymongo
from pymongo import MongoClient

import operator
import re

client = MongoClient('localhost', 27017)
db = client.politicat2

def clearTodayData(today):
    db.keywords.delete_many({'date': today})
    db.subkeywords.delete_many({'date': today})
    db.sub_article.delete_many({'date': today})

def insertArticle(keywords, title, url, date):
    hangul = re.compile('[^ ㄱ-ㅎ가-힣]+') # 한글,띄어쓰기만 남김
    nouns = hangul.sub('', title).split()

    inserted_id = db.articles.insert_one({'title': title, 'url': url, 'date': date}).inserted_id
    for i in range(len(nouns)):
        keywords.setdefault(nouns[i], [{}, 0])
        keywords[nouns[i]][1] += 1
        for j in range(len(nouns)):
            if nouns[i] == nouns[j]:
                continue
            subkeywords = keywords[nouns[i]][0]
            subkeywords.setdefault(nouns[j], [[], 0])
            subkeywords[nouns[j]][0].append(inserted_id)
            subkeywords[nouns[j]][1] += 1

def getTop(keywords):
    sorted_keywords = sorted(keywords.items(), key=lambda kv: operator.itemgetter(1)(kv[1]), reverse=True)
    del sorted_keywords[31:]

    for k,v in sorted_keywords:
        sorted_subkeywords = sorted(v[0].items(), key=lambda kv: operator.itemgetter(1)(kv[1]), reverse=True)
        del sorted_subkeywords[10:]

        v[0] = sorted_subkeywords

    return sorted_keywords

def insertKeywords(keywords, today):
    for k,v in keywords:
        upserted_id = db.keywords.update_one({'word':k, 'date': today}, {'$set':{'cnt':v[1]}}, True).upserted_id
        if upserted_id == None:
            upserted_id = db.keywords.find_one({'word':k, 'date': today}).get('_id')
        for k2,v2 in v[0]:
            sub_upserted_id = db.subkeywords.update_one({'word': k2, 'keyword_id':upserted_id, 'date': today}, {'$set':{'cnt': v2[1]}}, True).upserted_id
            if sub_upserted_id == None:
                sub_upserted_id = db.subkeywords.find_one({'word':k2, 'keyword_id':upserted_id, 'date': today}).get('_id')
            for v3 in v2[0]:
                db.sub_article.insert_one({'article_id': v3, 'subkeyword_id':sub_upserted_id, 'date': today})

