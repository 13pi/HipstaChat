$(function() {
    //Keep track of how many swipes
    var count=0;

    //Enable swiping...
    $("html").swipe( {
        //Generic swipe handler for all directions
        swipeLeft:function(event, direction, distance, duration, fingerCount) {
            $('#app').toggleClass('on-canvas');
            //                $(this).text("You swiped " + direction + " " + ++count + " times " );
        },

        swipeRight:function(event, direction, distance, duration, fingerCount) {
            $('#app').toggleClass('on-canvas');
            //                $(this).text("You swiped " + direction + " " + ++count + " times " );
        },

        //Default is 75px, set to 0 for demo so any distance triggers swipe
        threshold:75,
        cancelable:true

    });
});