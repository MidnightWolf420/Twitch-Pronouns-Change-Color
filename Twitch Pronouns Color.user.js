// ==UserScript==
// @name         Twitch Pronouns Color
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Change Twitch Pronouns Color
// @author       You
// @match        https://twitch.tv/*
// @match        https://dashboard.twitch.tv/*
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    function getLocalStorage(name) {
        return window.localStorage[name] ? window.localStorage[name] : "";
    }
    var keyPressed = {}; // You could also use an array
    onkeydown = onkeyup = function(e) {
        e = e || event; // to deal with IE
        var keyDown = (e.type == 'keydown');
        keyPressed[e.keyCode] = keyDown;
        this.setTimeout(() => {
            keyPressed[e.keyCode] = false;
        }, 1500)
        if (keyPressed[18] && keyPressed[82]) {
            keyPressed[18] = false;
            keyPressed[82] = false;
            var backgroundColor = window.prompt("Set Pronouns Background (CSS Color)", getLocalStorage("pronoun_background") == "" ? "green" : getLocalStorage("pronoun_background"));
            localStorage.setItem("pronoun_background", backgroundColor);
            var textColor = window.prompt("Set Pronouns Text Color (CSS Color)", getLocalStorage("pronoun_text_color") == "" ? "var(--color-text-base)" : getLocalStorage("pronoun_text_color"));
            localStorage.setItem("pronoun_text_color", textColor);
        }
    }
    window.onload = function() {
        if (getLocalStorage("pronoun_background") == "") {
            var backgroundColor = window.prompt("Set Pronouns Background (CSS Color)", "green");
            localStorage.setItem("pronoun_background", backgroundColor);
        }
        if (getLocalStorage("pronoun_text_color") == "") {
            var textColor = window.prompt("Set Pronouns Text Color (CSS Color)", "var(--color-text-base)");
            localStorage.setItem("pronoun_text_color", textColor);
        }
        setInterval(() => {
            if(!document.querySelector("style#user-pronoun-css") || !(new RegExp(`color: ${getLocalStorage("pronoun_text_color")} !important;`, "i").test(document.querySelector("style#user-pronoun-css").innerHTML)||new RegExp(`background: ${getLocalStorage("pronoun_background")} !important;`, "i").test(document.querySelector("style#user-pronoun-css").innerHTML))) {
                var style = document.createElement('style');
                style.id = 'user-pronoun-css'; // Set the id for the style tag
                style.innerHTML = `.user-pronoun {
               padding: 2px;
               font-weight: bold;
               border-radius: 5px;
               color: ${getLocalStorage("pronoun_text_color")} !important;
               background: ${getLocalStorage("pronoun_background")} !important;
               border: 1px solid var(--color-text-base);
            }`;
                document.head.appendChild(style);
            }
        }, 1000)
    }();
})();
