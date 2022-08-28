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
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }

    window.addEventListener("load", function(event)
    {
        if(getCookie("pronoun_background") == "") {
            var backgroundColor = window.prompt("Set Pronouns Background (CSS Color)","green");
            setCookie("pronoun_background", backgroundColor, 9999999999);
        }
        if(getCookie("pronoun_text_color") == "") {
            var textColor = window.prompt("Set Pronouns Text Color (CSS Color)","var(--color-text-base)");
            setCookie("pronoun_text_color", textColor, 9999999999);
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
