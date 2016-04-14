// Events
$('#aether-nav').find('form').on('submit', function(){
    var subreddit = $('#aether-subreddit').val();
    Reddit.getSubreddit(subreddit);
    return false;
}).trigger('submit');

$('#aether-load-more').on('click', function(){
    Reddit.getSubreddit(null);
    return false;
});