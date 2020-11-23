//Scrolling stuff
$(window).scroll(function(){
    var scrollPosition = $(window).scrollTop();

    var one = $('#one').offset().top,
        two = $('#two').offset().top,
        three = $('#three').offset().top,
        four = $('#four').offset().top,
        five = $('#five').offset().top,
        six = $('#six').offset().top,
        seven = $('#seven').offset().top,
        eight = $('#eight').offset().top,
        nine = $('#nine').offset().top,
        ten = $('#ten').offset().top;

    var nav1 = $('a[href="#one"]'),
        nav2 = $('a[href="#two"]'),
        nav3 = $('a[href="#three"]'),
        nav4 = $('a[href="#four"]'),
        nav5 = $('a[href="#five"]'),
        nav6 = $('a[href="#six"]'),
        nav7 = $('a[href="#seven"]'),
        nav8 = $('a[href="#eight"]'),
        nav9 = $('a[href="#nine"]'),
        nav10 = $('a[href="#ten"]');

    if(scrollPosition >= one) {
        $('.active').removeClass('active');
        $('#nav1').addClass('active');
        nav1.contents('li').text('Home');
        nav1.siblings().contents('li').text('');
    }
    if(scrollPosition >= two) {
        $('.active').removeClass('active');
        $('#nav2').addClass('active');
        nav2.contents('li').text('Genres');
        nav2.siblings().contents('li').text('');
    }
    if(scrollPosition >= three) {
        $('.active').removeClass('active');
        $('#nav3').addClass('active');
        nav3.contents('li').text('Bubbles');
        nav3.siblings().contents('li').text('');
    }
    if(scrollPosition >= four) {
        $('.active').removeClass('active');
        $('#nav4').addClass('active');
        nav4.contents('li').text('Stacked Areas');
        nav4.siblings().contents('li').text('');
    }
    if(scrollPosition >= five) {
        $('.active').removeClass('active');
        $('#nav5').addClass('active');
        nav5.contents('li').text('Audio Features');
        nav5.siblings().contents('li').text('');
    }
    if(scrollPosition >= six) {
        $('.active').removeClass('active');
        $('#nav6').addClass('active');
        nav6.contents('li').text('Par Coords');
        nav6.siblings().contents('li').text('');
    }
    if(scrollPosition >= seven) {
        $('.active').removeClass('active');
        $('#nav7').addClass('active');
        nav7.contents('li').text('Radars');
        nav7.siblings().contents('li').text('');
    }
    if(scrollPosition >= eight) {
        $('.active').removeClass('active');
        $('#nav8').addClass('active');
        nav8.contents('li').text('Audio Player');
        nav8.siblings().contents('li').text('');
    }
    if(scrollPosition >= nine) {
        $('.active').removeClass('active');
        $('#nav9').addClass('active');
        nav9.contents('li').text('Conclusion');
        nav9.siblings().contents('li').text('');
    }
    if(scrollPosition >= ten) {
        $('.active').removeClass('active');
        $('#nav10').addClass('active');
        nav10.contents('li').text('About Us');
        nav10.siblings().contents('li').text('');
    }
});
