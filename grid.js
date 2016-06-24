window.onload = function(){
$(document).ready(function () {
    //setup vars    
    var p = 1, clicking = false;
    //setup grids
    while (p < 501) {
        $('#designer').append('<div id=' + p + ' class="square"></div>');
        $('#board').append('<div id="p' + p + '" class="pixel"></div>');
        p++;
    }

    function fill(e) {
        var id = $(e).attr('id');
        $('#' + id).toggleClass('fill');
        $('#p' + id).toggleClass('fill');
    }
    $('.square').mousedown(function () { clicking = true; fill(this); });
    $(document).mouseup(function () { clicking = false; })
    $('.square').mouseenter(function () { if (clicking == false) return; fill(this); });

    $('.fillall').live('click', function () {
        $('.square, .pixel').addClass('fill');
    });
    $('.reset').live('click', function () {
        $('.square, .pixel').removeClass('fill');
    });
    $('.invert').live('click', function () {
        $('.square, .pixel').toggleClass('fill');
    });
});
}