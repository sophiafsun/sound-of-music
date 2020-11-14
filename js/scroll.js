//Scrolling stuff
$(window).scroll(function(){
    var scrollPosition = $(window).scrollTop();

    var one = $('#one').offset().top,
        two = $('#two').offset().top,
        three = $('#three').offset().top,
        four = $('#four').offset().top,
        five = $('#five').offset().top,
        six = $('#six').offset().top,
        seven = $('#seven').offset().top;

    var nav1 = $('a[href="#one"]'),
        nav2 = $('a[href="#two"]'),
        nav3 = $('a[href="#three"]'),
        nav4 = $('a[href="#four"]'),
        nav5 = $('a[href="#five"]'),
        nav6 = $('a[href="#six"]'),
        nav7 = $('a[href="#seven"]');

    if(scrollPosition >= one) {
        $('.active').removeClass('active');
        $('#nav1').addClass('active');
        nav1.contents('li').text('Intro');
        nav1.siblings().contents('li').text('');
    }
    if(scrollPosition >= two) {
        $('.active').removeClass('active');
        $('#nav2').addClass('active');
        nav2.contents('li').text('Vis 1');
        nav2.siblings().contents('li').text('');
    }
    if(scrollPosition >= three) {
        $('.active').removeClass('active');
        $('#nav3').addClass('active');
        nav3.contents('li').text('Vis 2');
        nav3.siblings().contents('li').text('');
    }
    if(scrollPosition >= four) {
        $('.active').removeClass('active');
        $('#nav4').addClass('active');
        nav4.contents('li').text('More Text');
        nav4.siblings().contents('li').text('');
    }
    if(scrollPosition >= five) {
        $('.active').removeClass('active');
        $('#nav5').addClass('active');
        nav5.contents('li').text('Vis 3');
        nav5.siblings().contents('li').text('');
    }
    if(scrollPosition >= six) {
        $('.active').removeClass('active');
        $('#nav6').addClass('active');
        nav6.contents('li').text('Vis 4');
        nav6.siblings().contents('li').text('');
    }
    if(scrollPosition >= seven) {
        $('.active').removeClass('active');
        $('#nav7').addClass('active');
        nav7.contents('li').text('Conclusion');
        nav7.siblings().contents('li').text('');
    }
});
