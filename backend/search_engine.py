
from omdb_api import Omdb_api
from itunes_api import Itunes_api
from movie import Movie
from google_play_api import Googleplay_scraper
from youtube_api import youtube_api_reader


class Search_engine():
    def __init__(self):
        self._omdb = Omdb_api()
        self._itunes = Itunes_api()
        self._google_play = Googleplay_scraper()
        self._youtube = youtube_api_reader()
    # return a movie list available by titles

    def search_by_title(self, title):
        movielist = self._omdb.get_movieList(title)
        moviedict = dict()
        i = 0

        for item in movielist:
            itemdict = dict()
            itemdict["title"] = item.getTitle()
            itemdict["date"] = item.getDate()
            itemdict['poster_link'] = item.getPoster()
            itemdict['id'] = item.getId()
            moviedict[i+1] = itemdict
            i += 1
        return {"keyword": title, "resultCount": i, "movies": moviedict}

    def get_movie(self, id):
        m = self._omdb.get_movie_byid(id)
        if (m is not None):
            new_date = m.getDate().date()
            print(new_date)
            return {"director": m.getDirector(), "AgeRestriction": m.getAge(), "runtime": m.getRuntime(), "title": m.getTitle(), "date": str(new_date.year)+"-"+str(new_date.month)+"-"+str(new_date.day), "poster_link": m.getPoster(),
                    "casts": m.getCasts(), "synopsis": m.getSynopsis(), "ratings":
                    {"imdb": m.getImdbRating(), "rt": m.getRtRating(), "mt": m.getMtRating()}}

    def get_Itunes(self, title, date):
        p = self._itunes.search_platform(title[1:len(title)-1], date)
        if p == None:
            return {"name": "iTunes", "link": "N/A", "price": "N/A"}
        else:
            return {"name": "iTunes", "link": p.getLink(), "price": p.getPrice()}

    def get_googlePlay(self, title, date):
        # print(title[1:len(title)-1])
        p = self._google_play.search_platform(title[1:len(title)-1], date)
        if p == None:
            return {"name": "iTunes", "link": "N/A", "price": "N/A"}
        else:
            return {"name": "iTunes", "link": p.getLink(), "price": p.getPrice()}

    def get_trailer(self, title, yr):
        term = title+" "+yr+" "+"trailor"
        return self._youtube.youtube_search(part='snippet',
                                            maxResults=1,
                                            q=term,
                                            )


if __name__ == "__main__":
    engine = Search_engine()
    movielist = engine.search_by_title("Rush hour")
    for item in movielist:
        print("title %s date %s" % (item.getTitle(), item.getDate()))
