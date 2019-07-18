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
youtobe_url="https://www.youtube.com/results?search_query=$movie_title+$movie_year+trailer"

# getting video link
wget -q -O- "$youtobe_url" |
egrep '<a href="/watch\?v=' |
sed "s|.*<a href=\"/watch\?v=||g" |
cut -d'"' -f1 |
head -1

# getting pic link
wget -q -O- "$youtobe_url" |
egrep '<img.*src=' |
egrep 'src="https://i.ytimg.com/vi/' |
sed "s/.*src=\"//g" |
cut -d'"' -f1 |
head -1

