
import urllib.request
from platforms import Platform
from datetime import datetime
import requests


class Itunes_api():
    def __init__(self):
        self._link = "https://itunes.apple.com/search?media=movie"

    def search_platform(self, title, ddate):
        # search the target_target_movie on itunes according its title and date
        title = title.lower()
        string = "&term=" + title
        new_date = datetime.strptime(ddate, '%Y-%m-%d')

        response = requests.get(self._link + string)
        result_dictionary = response.json()
        # no result found
        if(result_dictionary['resultCount'] == 0):
            return None

        # get the result list from the json
        results_list = result_dictionary['results']

        for item in results_list:

            date = self.date_convert(item['releaseDate'])
            # compare title and the date in result list
            if item['trackName'].lower() == title.lower() and date == new_date:
                #print("target_movie name: %s track name %s date %s target_movie date %s" % (target_movie.getTitle(),item['trackName'],date,target_movie.getDate()))
                # get the price of itunes
                if 'trackRentalPrice' in item.keys():
                    return Platform("itunes", item['trackRentalPrice'], item['trackViewUrl'])

                elif 'trackPrice' in item.keys():

                    return Platform("itunes", item['trackPrice'], item['trackViewUrl'])
                else:
                    for item_key in item.keys():
                        if 'Price' in item_key:

                            return Platform("itunes", item[item_key], item['trackViewUrl'])

                break

    def date_convert(self, date):
        if date == None or date == "N/A":
            return "N/A"
        date = date[0:10]
        return datetime.strptime(date, '%Y-%m-%d')
