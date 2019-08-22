$(document).ready( function() {
    console.log("ready");
    /* ========================================================================= */
	  /*	Parallax
	  /* ========================================================================= */
    $('#mainNav').parallax("50%", 0.1);
    $('#facts').parallax("50%", 0.7);
    $('#projects').parallax("50%", 0.7);
    $('#footer').parallax("50%", 0.1);

});



$( window ).on( "load", function() {
    /* ========================================================================= */
	  /*	Timer count
	      /* ========================================================================= */
    $('.timer').countTo();
    $(function () {
        var parent = $(".category-list ul");
        var divs = parent.children();
        while (divs.length) {
            parent.append(divs.splice(Math.floor(Math.random() * divs.length), 1)[0]);
        }
    });
    $('.filter').click(function() {
        $( ".filter" ).removeClass("active");
        $( this ).addClass("active");
        var dataFilter = $(this).data('filter');
        var animation_params = {
            duration: 500,
            specialEasing: {
                width: "linear",
            },
        };
        $( '.filter-li:not('+ dataFilter +')' ).slideUp();
        setTimeout(function(){
            $( dataFilter+":hidden" ).slideDown();
        },600);
    });
});
