// Events
$('#aether-nav').find('form').on('submit', function(){
    var subreddit = $('#aether-subreddit').val();
    Reddit.getSubreddit(subreddit);
    $('html, body').animate({
        scrollTop: '0px'
    }, 'fast');
    return false;
}).trigger('submit');

$('#aether-load-more').on('click', function(){
    Reddit.getSubreddit(null);
    return false;
});

$(window).on('keydown', function(e){
    if(e.keyCode == 40){
        e.preventDefault();

        let $next = false;
        let current_scroll = document.body.scrollTop;
        $('#aether-content').find('.item').each(function(index, value){
            if($(value).offset().top > current_scroll + 40 && $next === false){
                $next = $(value);
            }

        });
        if($next !== false){
            $('html, body').animate({
                scrollTop: ($next.offset().top - 40) + 'px'
            }, 'fast');
        }

    }
    if(e.keyCode == 38){
        e.preventDefault();

        let $next = false;
        let current_scroll = document.body.scrollTop;
        $($('#aether-content').find('.item').get().reverse()).each(function(index, value){
            if($(value).offset().top < current_scroll + 40 && $next === false){
                $next = $(value);
            }

        });
        if($next !== false){
            $('html, body').animate({
                scrollTop: ($next.offset().top - 40) + 'px'
            }, 'fast');
        }
    }
});