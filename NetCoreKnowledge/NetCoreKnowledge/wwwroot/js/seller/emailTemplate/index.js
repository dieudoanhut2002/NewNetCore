$('.clamp').click(function () {
    if ($(this).hasClass('clamp')) {
        $(this).css({
            '-webkit-line-clamp': 'unset',
            'max-height': 'none'
        });
        $(this).removeClass('clamp');
    } else {
        $(this).addClass('clamp').css({
            '-webkit-line-clamp': '2',
            'max-height': '3.6em'
        });
    }
});