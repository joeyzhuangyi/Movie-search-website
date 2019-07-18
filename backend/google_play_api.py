#import libraries
import urllib.request
from bs4 import BeautifulSoup
import requests
from platforms import Platform
from datetime import datetime


base_link = 'https://play.google.com'
# fine a movie's link by its title
# def search_movie(title,movie):
# specify the url
search_link = '/store/search?c=movies&q='


class Googleplay_scraper():
    def __init__(self):
        pass

    def search_platform(self, title, ddate):
        # searching key term
        text = title

        datetimeObj = datetime.strptime(ddate, '%Y-%m-%d')
        #date = str(self.convert_month(datetimeObj.month))
        #date += " "
        date = str(datetimeObj.year)
        # print(date)
        # print(text)
        # print("")
        quote_page = base_link+search_link+text
        # print(quote_page)
        source = requests.get(quote_page).text
        # do the search
        soup = BeautifulSoup(source, 'lxml')
        # check whether the result exist
        result = soup.find('div', attrs={'class': "empty-search"})
        # result is found
        if result == None:
            seeMore = soup.find(
                'a', class_="see-more play-button small id-track-click movies id-responsive-see-more")
            if seeMore == None:
                a = soup.find_all('a', class_="title")
                # for item in a:
                # print(item['href'])
                # print(item.text)
            else:
                seeMoreLink = seeMore['href']
                seeMoreLink = base_link+seeMoreLink
                seeMoreSource = requests.get(seeMoreLink).text
                seeMoreSoup = BeautifulSoup(seeMoreSource, 'lxml')
                movies = seeMoreSoup.find_all(
                    'div', class_="card no-rationale tall-cover movies small")
                for movie in movies:

                    div_list = movie.div.find('div', class_="reason-set")
                    if(div_list.a != None):
                        movie_title = div_list.a['href'].split('/')[4]
                        movie_title = movie_title.split('?')[0]
                        # title of movies
                        movie_title = movie_title.replace("_", " ")
                        # print(movie_title)
                        # movie links
                        movieLink = base_link + div_list.a['href']
                        movieSource = requests.get(movieLink).text
                        movieSoup = BeautifulSoup(movieSource, "lxml")
                        # movie dates
                        movie_date = movieSoup.find(
                            'span', class_="UAO9ie").text
                        movie_date = movie_date[len(
                            movie_date)-4:len(movie_date)]
                        # print(movie_date)
                        movie_price = movieSoup.find('meta', itemprop="price")
                        if movie_price != None:
                            movie_price = movie_price['content']
                        # print(movie_price)
                        if text.lower() == movie_title.lower() and movie_date == date:
                            return Platform("Google PlayStore", price=movie_price, link=movieLink)
                        else:
                            continue
            return None

        else:
            return None

    def convert_month(self, month):
        switcher = {
            1: "January",
            2: "February",
            3: "March",
            4: "April",
            5: "May",
            6: "June",
            7: "July",
            8: "August",
            9: "September",
            10: "October",
            11: "November",
            12: "December"
        }
        return switcher.get(month, "Invalid month")
