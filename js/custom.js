$(document).ready( function() {
    console.log("ready");
    /* ========================================================================= */
	  /*	Parallax
	  /* ========================================================================= */
    $('#mainNav').parallax("50%", 0.1);
    $('#facts').parallax("50%", 0.7, "10%");
    $('#projects').parallax("50%", 0.7);
    $('#footer').parallax("50%", 0.1);

});



$( window ).on( "load", function() {


    /* ========================================================================= */
	  /*	Filter Projects
	      /* ========================================================================= */

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
    /* ========================================================================= */
	  /*	Email Hide
	      /* ========================================================================= */
    $('.linkmail').hover(function(){
        // here you can use whatever replace you want
        var newHref = $(this).attr('href')
            .replace('example.spam', $(this).data('email'));
        $(this).attr('href', newHref);
    });

    /* ========================================================================= */
	  /*	Download PGP Key
	      /* ========================================================================= */
    $('a#download-key').click(function(e) {
        e.preventDefault();  //stop the browser from following
        window.location.href = 'misc/nicola-sella.asc';
    });

    /* ========================================================================= */
	  /*	View PGP Key
	      /* ========================================================================= */
    $( 'a#view-key' ).click( function() {
        $( 'code.pubkey' ).slideToggle();
    });

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


    $('.clickable-row').hover(function(){
        // here you can use whatever replace you want
        if( $(this).data('href') == "javascript:;" ) return false;
        var newHref = $(this).data('href')
            .replace('example.spam', $(this).data('email'));
        $(this).data('href', newHref);
    });
    $(".clickable-row").click(function() {
        if( $(this).data('href') == "javascript:;" ) return false;
        window.open($(this).data("href"), '_blank');
    });
});
