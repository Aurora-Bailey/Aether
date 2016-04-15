class Lib {
    static objectKeyArray(obj){
        var arr = [];

        for(var key in obj)
            arr.push(key);

        return arr;
    }

    // Takes an object (obj.a = 10 obj.b = 20 etc...) returns the random key (b)
    static weightedRandom(obj){
        var total = 0;
        for(var key in obj)
            total += obj[key];

        var r = Math.random() * total;

        for(var key in obj){
            if(r < obj[key])
                return key;
            r -= obj[key];
        }
    }

    static randomProperty(obj){
        var total = 0;
        for(var key in obj)
            total += 1;

        var r = Math.random() * total;

        for(var key in obj){
            if(r < 1)
                return obj[key];
            r -= 1;
        }
    }

    static inCommonProperty(obj, obj2){
        var r = {};
        for(var key in obj)
            if(typeof obj2[key] !== 'undefined')
                r[key] = obj[key];

        return r;
    }

    static notProperty(obj, exclude_arr){
        var r = {};
        for(var key in obj)
            if(exclude_arr.indexOf(key) == -1)
                r[key] = obj[key];

        return r;
    }

    static deepCopy(obj){
        return JSON.parse(JSON.stringify(obj));
    }

    static isObjEmpty(obj){
        // null and undefined are "empty"
        if(obj == null)
            return true;

        // Assume if it has a length property with a non-zero valuehttp%3A%2F%2Flocalhost%3A4000%2F
        // that that property is correct.
        if(obj.length > 0)
            return false;
        if(obj.length === 0)
            return true;

        // Otherwise, does it have any properties of its own?
        // Note that this doesn't handle
        // toString and valueOf enumeration bugs in IE < 9
        for(var key in obj){
            if (obj.hasOwnProperty(key))
                return false;
        }

        return true;
    }

    static socialMediaPost(site, url){
        if(site == 'facebook')
            window.open('http://www.facebook.com/share.php?u=' + url, 'Facebook', 'width=550,height=400');
        else if(site == 'twitter')
            window.open('http://twitter.com/intent/tweet?status=' + $(document).find("title").text() + '+' + url, 'Twitter', 'width=550,height=400');
    }

    static extractDomain(url) {
        var domain;

        //find & remove protocol (http, ftp, etc.) and get domain
        if (url.indexOf("://") > -1)
            domain = url.split('/')[2];
        else
            domain = url.split('/')[0];

        //find & remove port number
        domain = domain.split(':')[0];
        return domain;
    }

    static resolveLinkMedia(link, callback){
        var ext = link.split('.').pop();
        var domain = this.extractDomain(link);

        if(ext == 'jpg' || ext == 'gif' || ext == 'png' || ext == 'webp'){
            // Link IS an image
            callback({type: 'image', data: [{link: link}]});

        }else if(domain == 'imgur.com' || domain == 'i.imgur.com'){
            var imgur_id = link.split('/').pop();
            var imgur_api = 'https://api.imgur.com/3';
            var imgur_auth = 'Client-ID 1a264d08fe7cd9c';

            if(link.match(/^https?:\/\/i?\.?imgur\.com\/a\/[a-z0-9]+$/gi)){// /a/{id} ALBUM
                $.ajax({
                    url: imgur_api + '/album/' + imgur_id + '.json',
                    type: 'GET',
                    headers: {
                        Authorization: 'Client-ID 1a264d08fe7cd9c',
                        Accept: 'application/json'
                    },
                    dataType: 'json',
                    success: function(result){
                        callback({type: 'imgur', data: result.data.images});
                    }
                });

            }else if(link.match(/^https?:\/\/i?\.?imgur\.com\/[a-z0-9]+$/gi)){// /{id} ROOT
                $.ajax({
                    url: imgur_api + '/image/' + imgur_id + '.json',
                    type: 'GET',
                    headers: {
                        Authorization: 'Client-ID 1a264d08fe7cd9c',
                        Accept: 'application/json'
                    },
                    dataType: 'json',
                    success: function(result){
                        callback({type: 'imgur', data: [result.data]});
                    }
                });

            }else if(ext == 'gifv'){// {id}.gifv GIFV
                imgur_id = imgur_id.split('.')[0];// remove .gifv
                $.ajax({
                    url: imgur_api + '/image/' + imgur_id + '.json',
                    type: 'GET',
                    headers: {
                        Authorization: 'Client-ID 1a264d08fe7cd9c',
                        Accept: 'application/json'
                    },
                    dataType: 'json',
                    success: function(result){
                        callback({type: 'imgur', data: [result.data]});
                    }
                });
            }
        }


    }
}


class Reddit {
    static init(){
        this.$container = $('#aether-content');
        this.$template = $('#aether-templates').find('.item');
        this.subreddit = null;
        this.page = false; // for paging
        this.processing = false;
    }

    static getSubreddit(subreddit){// null for concat
        this.processing = true;
        if(subreddit !== null){
            this.subreddit = subreddit;
            this.page = false;

            this.fetchDescription((results)=>{
                var description;
                if(results === 'error'){// Artificial "default" description
                    description = '/r/All /r/Funny /r/Pics /r/BattleStations /r/Aww';
                }else{
                    description = results.data.description_html;
                }
                this.descriptionSubreddits(description, (subreddits)=>{
                    $('#aether-subreddit-list').html('');
                    subreddits.forEach(function(value){
                        $('#aether-subreddit-list').append($('#aether-templates').find('.subreddit-li').clone().html(value));
                    });
                });
            });
        }

        this.fetchSubreddit((results)=>{
            this.buildSubreddit(results.data.children, this.page === false);
            this.page = results.data.after;
        });
    }

    static buildSubreddit(posts, fresh){
        if(fresh)
            this.$container.html('');

        posts.forEach((p)=>{
            var {url, permalink, score, thumbnail, title, author, num_comments, saved, subreddit, domain} = p.data;
            var reddit_url = 'https://reddit.com' + permalink;

            var $item = this.$template.clone();
            $item.find('.title').html(title);
            $item.find('.subreddit').html('subreddit: ' + subreddit);
            $item.find('.author').html('op: ' + author);
            $item.find('.score').html('score: ' + score);
            $item.find('.link-reddit').html('<a target="_blank" href="' + reddit_url + '">view on reddit (' + num_comments + ' comments)</a>');
            $item.find('.link-url').html('<a target="_blank" href="' + url + '">view on '+ domain +'</a>');

            Lib.resolveLinkMedia(url, (media)=>{
                if(media.type == 'image'){
                    $item.find('.aether-media').append('<img src="' + media.data[0].link + '">');
                }else if(media.type == 'imgur'){
                    media.data.forEach(function(image){
                        if(image.animated == false){
                            $item.find('.aether-media').append('<img src="' + image.link + '">');
                        }else{
                            var $vid = $('<video autoplay="" loop="" muted="" preload="" class="aether-gifv"></video>');
                            $vid.append($('<source src="' + image.webm + '" type="video/webm" class="aether-gifv-src-webm">'));
                            $vid.append($('<source src="' + image.mp4 + '" type="video/mp4" class="aether-gifv-src-mp4">'));
                            $item.find('.aether-media').append($vid);
                        }
                    });
                }

                // Only append to container if media is found
                this.$container.append($item);
            });
        });
    }

    static fetchSubreddit(callback){
        if(this.subreddit === null)
            return false;

        var url = 'https://www.reddit.com/r/' + this.subreddit + '/.json?raw_json=1&t=year';

        if(this.page !== false)
            url += '&count=25&after=' + this.page;

        $.getJSON(url, function(response){
            callback(response);
        });
    }

    static fetchDescription(callback){
        if(this.subreddit === null)
            return false;

        var url = 'https://www.reddit.com/r/' + this.subreddit + '/about.json';

        $.getJSON(url, function(response){
            if(typeof response.error == 'undefined')
                callback(response);
        }).error(function(){
            callback('error');
        });
    }

    static descriptionSubreddits(description, callback){
        // pull the subreddits out of the description
        var subreddits = description.match(/\/r\/[A-Z0-9]+/gi);

        // remove duplicates
        var subreddits_unique = [];
        subreddits.forEach(function(value){
            if(subreddits_unique.indexOf(value) === -1)
                subreddits_unique.push(value);
        });

        // remove lowercase if duplicate
        subreddits_unique.forEach(function(value){
            if(value.search(/[A-Z]/g) !== -1){
                var lower_case_version = subreddits_unique.indexOf(value.toLowerCase());
                if(lower_case_version !== -1)
                    subreddits_unique[lower_case_version] = '';
            }
        });

        // remove the now empty cells, and remove /r/
        var subreddits_uppercase = [];
        subreddits_unique.forEach(function(value){
            if(value != '')
                subreddits_uppercase.push(value.replace('/r/', '').toUpperCaseFirst());
        });
        subreddits_uppercase.sort();
        callback(subreddits_uppercase);
    }
}
Reddit.init();







