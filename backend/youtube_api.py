
from apiclient.discovery import build
from apiclient.errors import HttpError
# from oauth2client.tools import argparser


class youtube_api_reader():
    def __init__(self):
        self._DEVELOPER_KEY = "AIzaSyAydWBaPvlWkNOvwZ3mwCRaUzubdY0h96M"
        self._YOUTUBE_API_SERVICE_NAME = "youtube"
        self._YOUTUBE_API_VERSION = "v3"
        self._youtube = build(self._YOUTUBE_API_SERVICE_NAME, self._YOUTUBE_API_VERSION,
                              developerKey=self._DEVELOPER_KEY)

    def youtube_search(self, **kwargs):

        kwargs = self.remove_empty_kwargs(**kwargs)
        keyword = ""
        search_response = self._youtube.search().list(
            **kwargs

        ).execute()
        if len(search_response['items']) == 0:
            return({
                "link": "https://www.youtube.com/results?search_query="+keyword, "pic": "N\A"
            })
        else:
            item = search_response['items'][0]

            videolink = "https://www.youtube.com/results?search_query="+keyword
            if item['id']['videoId'] != None:
                videolink = "https://www.youtube.com/watch?v=" + \
                    str(item['id']['videoId'])

            return(
                {
                    "link": videolink, "pic": item['snippet']['thumbnails']['high']['url']
                }
            )

    # Remove keyword arguments that are not set

    def remove_empty_kwargs(self, **kwargs):
        good_kwargs = {}
        if kwargs is not None:
            for key, value in kwargs.items():
                if value:
                    good_kwargs[key] = value
        return good_kwargs


if __name__ == "__main__":
    api = youtube_api_reader()
    """
    print(api.youtube_search(part='snippet',
                             maxResults=1,
                             q='rush hour trailer',
                             ))
                             """
    pass
