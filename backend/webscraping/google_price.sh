#!/bin/sh

if test $# != 2
then
    echo "Usage: $0 <Movie-Title> <Movie-Year>"
    exit 1
fi
movie_year=$2
movie_title=`echo "$1" |
            sed "s/_//g"`
            #echo "$movie_title"
            #https://play.google.com/store/search?q=transformers&c=movies
google_url="https://play.google.com/store/search?q=$movie_title+$movie_year"
# amazone_url="https://www.amazon.com/s?k=$movie_title&i=instant-video"


# get the price
wget -q -O- "$google_url" |
egrep -o "<span class=\"display-price\">.*" |
cut -d'>' -f2 |
cut -d'<' -f1


# the link
echo "$google_url"


exit 0