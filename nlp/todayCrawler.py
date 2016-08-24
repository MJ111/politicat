import requests
from bs4 import BeautifulSoup
import time

import NlpTitles as nlp

from datetime import datetime, timedelta

def scrapFrom():
    monthago = datetime.strptime('20160825', '%Y%m%d') - timedelta(days=150)

    for i in range(240):
        today = monthago.strftime("%Y%m%d")
        nlp.clearTodayData(today)

        spider(today, 100)
        spider(today, 102)
        monthago += timedelta(days=1)

def spider(today, section):
    url = 'http://news.naver.com/main/list.nhn?sid1=' + str(section) + '&listType=title&mid=sec&mode=LSD&date=' + today + '&page='
    keywords = {}

    page = 1
    while True:
        source_code = requests.get(url+str(page))
        plain_text = source_code.text
        soup = BeautifulSoup(plain_text, 'lxml')
        for link in soup.select('div.list_body ul.type02 a'):
            title = link.string
            nlp.insertArticle(keywords, title, link.get('href'), today)

        pages = soup.select('div.paging > *')
        lastPage = pages[len(pages)-1].string
        if lastPage == '다음' or lastPage != str(page):
            page += 1
        else:
            nlp.insertKeywords(nlp.getTop(keywords), today)
            break

scrapFrom()
