document.addEventListener('DOMContentLoaded', function () {
    var chat, inp, left, messages, render, right, rooms, wrap;
    left = document.getElementById('left');
    chat = document.getElementById('chat');
    right = document.getElementById('right');
    wrap = document.getElementById('wrapper');
    rooms = document.getElementById('rooms');
    messages = document.getElementById('messages');
    inp = document.getElementsByClassName('inp')[0];
    render = function () {
        rooms.style.height = "" + (window.innerHeight - 39) + "px";
        messages.style.height = "" + (window.innerHeight - 55) + "px";
        wrap.style.width = "" + window.innerWidth + "px";
        chat.style.width = "" + (window.innerWidth - (210 + 180)) + "px";
        return inp.style.width = "" + window.innerWidth + "px";
    };
    render();
    return window.addEventListener('resize', render);
});
