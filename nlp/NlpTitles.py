# run with 'python3 nlpTitles.py'

from datetime import datetime, timedelta

import pymongo
from pymongo import MongoClient

from konlpy.corpus import kolaw
from konlpy.tag import Hannanum

client = MongoClient('localhost', 27017)
db = client.politicat

def main():
    doc = kolaw.open('constitution.txt').read()
    lines = doc.split('\n')
    insertDataToDB(lines)

def insertDataToDB(data):
    for l in data:
        nouns = Hannanum().nouns(l)

        for n in nouns:
            n_obj = db.keywords.find_one({'keyword' : n})
            n_id = -1

            if n_obj == None:
                n_id = db.keywords.insert_one({'keyword' : n}).inserted_id
                print('keyword inserted: ', n_id)
            else:
                n_id = n_obj['_id']

            for related in nouns:
                if n == related:
                    continue

                related_obj = db.keywords.find_one({'keyword' : related})
                related_id = -1

                if related_obj == None:
                    related_id = db.keywords.insert_one({'keyword' : related}).inserted_id
                    print('keyword inserted: ', related_id)
                else:
                    related_id = related_obj['_id']

                relation_obj = db.keyword_relations.find_one({'keyword1_id' : n_id, 'keyword2_id' : related_id})
                if relation_obj == None:
                    relation_obj = db.keyword_relations.find_one({'keyword1_id' : related_id, 'keyword2_id' : n_id})

                relation_id = -1

                if relation_obj == None:
                    relation_id = db.keyword_relations.insert_one({'keyword1_id' : n_id, 'keyword2_id' : related_id, 'total_count' : 1, 'count_in_day' : 1, 'updated_at' : datetime.utcnow()}).inserted_id
                    print('relation inserted: ', relation_id)
                else:
                    relation_id = relation_obj['_id']
                    if datetime.utcnow() - relation_obj['updated_at'] > timedelta(days=1):
                        result = db.keyword_relations.update_one({'_id' : relation_id}, {'$set' : {'count_in_day' : 1, 'updated_at' : datetime.utcnow()}, '$inc' : {'total_count' : 1}})
                        print('relation updated : count_in_day initialized')
                    else:
                        result = db.keyword_relations.update_one({'_id' : relation_id}, {'$set' : {'updated_at' : datetime.utcnow()}, '$inc' : {'total_count' : 1, 'count_in_day' : 1}})
                        print('relation updated : count_in_day incremented')

def findRelatedKeywords(keyword):
    related_keyword = {}

    keyword_id = db.keywords.find_one({'keyword' : keyword})['_id']

    result1 = db.keyword_relations.find({'keyword1_id' : keyword_id})
    result2 = db.keyword_relations.find({'keyword2_id' : keyword_id})

    for r in result1:
        r_keyword = db.keywords.find_one({'_id' : r['keyword2_id']})['keyword']
        related_keyword[r_keyword] = True

    for r in result2:
        r_keyword = db.keywords.find_one({'_id' : r['keyword1_id']})['keyword']
        related_keyword[r_keyword] = True

    print('result: ', related_keyword.keys())
    return related_keyword.keys()

main()
