(function($) {

    $.fn.famousPeople = function( options ) {

        // Establish our default settings
        var settings = $.extend({
            number         :1,
            width        : null,
            height       : null,
            source       : null
        }, options);

        return this.each( function() {
            $(this).append('<div class="famous_wrapper"></div>');
            $('.famous_wrapper').append('<img>').attr('src', settings.source);

        });

    }

}(jQuery));
<script>

$('.span4').append('<div class="famous_wrapper"></div>');
$('.famous_wrapper').append('<img src="famous_people_sprite.png" alt="Famous People">');
</script>
