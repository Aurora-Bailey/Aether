// Events
/*
$.getJSON('https://www.reddit.com/r/all.json', function(response){
    var posts = response.data.children;

    posts.forEach(function(p){
        var thumbnail = p.data.thumbnail;
        var domain = p.data.domain;
        var title = p.data.title;
        var url = p.data.url;
        var ext = url.split('.').pop();

        $("body").append(title)
            .append('<br>')
            .append(url)
            .append('<br>')
            .append('<img src="' + thumbnail + '">')
            .append('<br>')
            .append('<br>');

        if(ext == 'jpg' || ext == 'gif' || ext == 'png' || ext == 'webp'){
            console.log('Native image: ', ext, ' == ', url);

        }else if(domain == 'imgur.com' || domain == 'i.imgur.com'){
            console.log('imgur: ', url);

            var imgur_id = url.split('/').pop()


            if(url.match(/^https?:\/\/i?\.?imgur\.com\/a\/[a-z0-9]+$/gi)){// /a/{id}
                console.log('get album: ', 'https://api.imgur.com/3/album/' + imgur_id);
                $.getJSON('https://api.imgur.com/3/album/' + imgur_id, function(response){
                    console.log(response);
                });
            }else if(url.match(/^https?:\/\/i?\.?imgur\.com\/[a-z0-9]+$/gi)){// /{id}
                var img_url = url.replace('/imgur', '/i.imgur') + '.jpg';
                console.log(img_url);
                $("body").append('<img src="' + img_url + '">')
                    .append('<br>')
                    .append('<br>');
            }else if(url.match(/^https?:\/\/i?\.?imgur\.com\/[a-z0-9]+\.jpg$/gi)){// /{id}.jpg
                var img_url = url.replace('/imgur', '/i.imgur');
                console.log(img_url);
                $("body").append('<img src="' + img_url + '">')
                    .append('<br>')
                    .append('<br>');
            }
        }

    });



    console.log(response);
    console.log(posts);
});
*/

$('#aether-nav').find('form').on('submit', function(){
    var subreddit = $('#aether-subreddit').val();
    Reddit.getSubreddit(subreddit);
    return false;
}).trigger('submit');

$('#aether-load-more').on('click', function(){
    Reddit.getSubreddit(null);
    return false;
});