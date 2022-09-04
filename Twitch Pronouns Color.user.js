// ==UserScript==
// @name         Twitch Pronouns Color
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Change Twitch Pronouns Color
// @author       You
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = document.cookie;
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
    }

    function setCookie(name,value,days) {
        var expires = "; expires=" + new Date(2147483647 * 1000).toUTCString();
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }
    var keyPressed = {}; // You could also use an array
    onkeydown = onkeyup = function(e){
        e = e || event; // to deal with IE
        var keyDown = (e.type == 'keydown');
        keyPressed[e.keyCode] = keyDown;
        this.setTimeout(() => {
            keyPressed[e.keyCode] = false;
        }, 1500)
        if(keyPressed[18] && keyPressed[82]) {
            keyPressed[18] = false;
            keyPressed[82] = false;
            var backgroundColor = window.prompt("Set Pronouns Background (CSS Color)", getCookie("pronoun_background")==""?"green":getCookie("pronoun_background"));
            setCookie("pronoun_background", backgroundColor);
            var textColor = window.prompt("Set Pronouns Text Color (CSS Color)", getCookie("pronoun_text_color")==""?"var(--color-text-base)":getCookie("pronoun_text_color"));
            setCookie("pronoun_text_color", textColor);
        }
    }
    window.addEventListener("load", function(event)
    {
        if(getCookie("pronoun_background") == "") {
            var backgroundColor = window.prompt("Set Pronouns Background (CSS Color)","green");
            setCookie("pronoun_background", backgroundColor);
        }
        if(getCookie("pronoun_text_color") == "") {
            var textColor = window.prompt("Set Pronouns Text Color (CSS Color)","var(--color-text-base)");
            setCookie("pronoun_text_color", textColor);
        }
        setInterval(() => {
            var styles = document.getElementsByTagName("style")
            for(var i = 0; i < styles.length; i++) {
                var style = styles[i]
                if(style.outerHTML.includes(`.user-pronoun {`)) {
                    var user_pronounCss = style.outerHTML.match(/.user-pronoun {(\s|\n|.)+?\}/)[0]
                    var textColorRegex = new RegExp(getCookie("pronoun_text_color"), "i")
                    var startOfStyle = style.outerHTML.match(/.user-pronoun {(\s| |\n){0,}padding: .+?;(\s| |\n){0,}font-weight: .+?;(\s| |\n){0,}border-radius: .+?;(\s| |\n){0,}color: .+?;/)[0];
                    if(!textColorRegex.test(startOfStyle)) {
                        style.outerHTML = style.outerHTML.replace(startOfStyle, startOfStyle.replace(/color:.+?;/, `color: ${getCookie("pronoun_text_color")};`));
                    }
                    if(!user_pronounCss.includes(`background:`)) {
                        style.outerHTML = style.outerHTML.replace(startOfStyle, `${startOfStyle}\n  background: ${getCookie("pronoun_background")};`);
                    } else {
                        if(user_pronounCss != user_pronounCss.replace(/background: .+?;/, `background: ${getCookie("pronoun_background")};`)) {
                            style.outerHTML = style.outerHTML.replace(user_pronounCss, user_pronounCss.replace(/background: .+?;/, `background: ${getCookie("pronoun_background")};`));
                        }
                    }
                }
            }
        }, 500)
    });
})();
