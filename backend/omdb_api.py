import urllib.request
from movie import Movie
from datetime import datetime
import requests


class Omdb_api():
    def __init__(self):
        self._link = "http://www.omdbapi.com/?apikey=358bbe35"

    def get_movie_byid(self, id):

        string = "&i=" + id
        response = requests.get(self._link + string)
        result_dictionay = response.json()
        if result_dictionay['Response'] == "False":
            return None
        movie = Movie(
            id, result_dictionay['Rated'], result_dictionay['Runtime'], result_dictionay['Director'])
        movie.setTitle(result_dictionay['Title'])
        movie.setDate(self.date_convert(result_dictionay['Released']))
        movie.setPoster(result_dictionay['Poster'])

        movie.setSynopsis(result_dictionay['Plot'])

        casts = result_dictionay['Actors']

        casts_list = casts.split(", ")
        for name in casts_list:
            movie.add_cast(name)

        ratings = result_dictionay['Ratings']

        for tmp in ratings:
            if tmp['Source'] == "Rotten Tomatoes":
                movie.setRtRating(tmp['Value'])
            if tmp['Source'] == "Metacritic":
                movie.setMtRating(tmp['Value'])

        movie.setImdbRating(result_dictionay['imdbRating'])

        return movie

    def get_movieList(self, title):
        string = '&type="Movie"&s='+title
        response = requests.get(self._link + string)
        result_dictionay = response.json()
        # check if there is any matching result
        if result_dictionay['Response'] == "False":
            return []

        movie_List = list()
        search_resultList = result_dictionay['Search']

        for item in search_resultList:
            newMovie = Movie(
                item['imdbID'], title=item['Title'], date=item['Year'], pic=item['Poster'])
            movie_List.append(newMovie)
        return movie_List

    def date_convert(self, date):
        if date == None or date == "N/A":
            return "N/A"
        return datetime.strptime(date, '%d %b %Y')
