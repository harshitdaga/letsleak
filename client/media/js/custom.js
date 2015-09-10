/**
 * Created by kirankumarnaidu on 5/13/14.
 */

$(window).scroll(function () {
    if ($(window).scrollTop() >= 50) {
        $('.navbar-static-top').addClass('shadow');
        $('.logo-icon').addClass('shadow');
    }
    else {
        $('.navbar-static-top').removeClass('shadow');
        $('.logo-icon').addClass('shadow');
    }
});