(function($) {

  $.fn.famousPeople = function( options ) {

    // Establish our default settings
    var settings = $.extend({
      number         :1,
      width        : null,
      height       : null,
      source       : null,
      quotes       : null,
      links        : null
    }, options);

    // Get basics about sprite image
    var width = settings.width,
        height = settings.height,
        totalWidth = width * settings.number,
        startingPoints = [],
        firstQuote = [],
        quoteCycle = null,
        i = 0;

    // Now find the sprite starting points
    for (i = 0; i < totalWidth; i += width){
      startingPoints.push(i);
    }

    // Create famous people objects to store quotes and info
    var people = [];
    var famousPeople = {};
    for (i = 0; i < startingPoints.length; i++){
        famousPeople['person' + i] = {
        location : startingPoints[i],
        quotes   : settings.quotes[i],
        links    : settings.links[i],
        id       : i
      };
      people.push(famousPeople['person' + i]);
    }
    // Shuffle the people around
    people.sort(function() { return 0.5 - Math.random() });

    // Quote cycle
      quoteCycle = function(person){
        firstQuote = person.quotes.shift();
        person.quotes.push(firstQuote);
      };

    // Interactions
    var id,
        active = false,
        $frame,
        animationCount,
        rotation,
        rotateRight,
        rotateLeft,
        rotateHome;

    rotation = function(direction){
      animationCount += 1;
      var configObject = {
          duration: 100,
          center: ["65%", "50%"]
      }

      if (direction === 'right'){
        configObject.animateTo = 5;
        configObject.callback = function () {
          if (animationCount < 4) {
            rotateLeft();
          }
        }
      } else if ( direction === 'left') {
        configObject.animateTo = -5;
        configObject.callback = function () {
          if (animationCount < 4) {
            rotateRight();
          } else {
            return rotateHome();
          }
        }
      } else {
        $frame.stopRotate();
        configObject.animateTo = 0;
        configObject.angle = 0;
        active = false;
      }
      $frame.rotate(configObject);
    }

    rotateRight = function () {

      rotation('right');
    };

    rotateLeft = function () {

      rotation('left');
    };

    rotateHome = function () {
        rotation('home');
    };

    // Attach mouseover event
    this.on('mouseover', '.portrait', function() {
      if (active){
        return;
      } else {
        active = true;
        $frame = $(this).closest('div');
        // Switch the quotes
        id = $(this).data("info");
        person = famousPeople["person" + id];
        $(this).parent('a').siblings('.quoteholder').find('span').fadeOut(1).text(person.quotes[0]).fadeIn(500);
        quoteCycle(person);

        // Call rotation functions
        animationCount = 0;
        rotation('right');

      }
    });


    return this.each( function(element) {
      var person,
          $image,
          $quote,
          $wrapper,
          $link,
          $quoteholder;


      // Place the images and give initial quote
      for (var i = 0; i < settings.show; i++) {

        person = people.pop();
        $link = $('<a>',{
          href: person.links,
          "class" : "fp_link"
        })

        $image = $('<img>',{
          src: settings.source,
          attr: {
            "data-info": person.id
          },
          "class" : "portrait",
          css: {
            position: "absolute",
            left: -person.location,
            "min-width": totalWidth
          }
        });

        $quote = $('<span>', {
          "class" : "quote",
          text : person.quotes[0]
        });

        // Because firefox is being fickle
        $quoteholder = $('<div>',{
          "class" : "quoteholder",
          css: {
            display: "table",
            height: "inherit"
          }
        });

        // Cycle the quote
        quoteCycle(person);


        $wrapper = $('<div>', {
          "class" : "famous-person",
          css:{
            width : width,
            height : height,
            overflow : "hidden",
            position : "relative"
          }
        }).append($image).append($quote);

        $image.wrap($link);
        $quote.wrap($quoteholder);

        $(this).append($wrapper);
      };
    });
  };

})(jQuery);
$(document).ready(function(){
  jQuery("#sidebar").famousPeople({
    number : 5,
    show   : 3,
    height : 451,
    width  : 455,
    source : "js/famouspeople/famous_people_sprite.png",
    quotes : [
                ["The Importance of Using Shmoop","This Picture is Boring and Gray.","I'm a Wilde and crazy kid."],
                ["The coldest winter I ever spent was a summer without Shmoop.", "I'll be your Huckleberry.", "Who you callin' Sam Clemens?" ],
                ["Beat! Beat! Shmoop!", "I may write free verse, but you still need to pay for my book.", "Better with a beard."],
                ["I'm the old man and the typewriter.", "I'm glad I'm not an amputee. I'd hate to have to say farewell to my arms.", "Brevity is the soul of wit. Or so I'm told."],
                ["In each of my books is a Colonel (Brandon) of truth.","Popular fiction by and about women—what a novel idea!","Hey ladies: you're welcome for creating Mr. Dar"]
              ],
    links  : ["http://www.shmoop.com/oscar-wilde/", "http://www.shmoop.com/mark-twain/", "http://www.shmoop.com/walt-whitman/", "http://www.shmoop.com/ernest-hemingway/", "http://www.shmoop.com/jane-austen/"]
  });
});
