const mainPage = (function() {
    var _windowW = window.innerWidth;
    var _windowH = window.innerHeight;
    var _newWindow = true;
    var _noVideo = false;
    var _videoTime, _txtInterval, _txtTime;

    var getIndex = function(element) {
        for(var i = 0; i < element.parentNode.children.length; i++) {
            if (element.parentNode.children[i] === element) {
                return i;
            }
        }
    }

    var addClassName = function(element, className) {
        if (element.className)
            return;

        element.className = className;
    }

    var removeClassName = function(element, className) {
        if (!element.className)
            return;
        
        element.classList.remove(className);
    }

    var heroAnimation = function() {
        var _currentNum = 0;

        _videoTime = setTimeout(function() {
            startAnimation();
        }, 2000);

        var startAnimation = function() {
            _txtInterval = setInterval(function() {
                var heroTxtBox = document.getElementsByClassName('hero-txt-box')[0];
                var heroTxts = heroTxtBox.lastElementChild;
    
                var otherIndex = [((_currentNum+1) > 2) ? 0 : _currentNum+1, ((_currentNum-1) < 0) ? 2 : _currentNum-1];
    
                removeClassName(heroTxtBox.children[_currentNum], 'effect');
                for(j=0; j<otherIndex.length; j++) {
                    addClassName(heroTxtBox.children[otherIndex[j]], 'effect');
                    TweenMax.to(heroTxts.children[otherIndex[j]], 0, {top:50, opacity:0, ease:Power3.easeOut});
                    heroTxts.children[otherIndex[j]].style.display = "none";
                }
                heroTxts.children[_currentNum].style.display = "block";
                TweenMax.to(heroTxts.children[_currentNum], 0.5, {top:0, opacity:1, ease:Power3.easeOut});
    
                _currentNum++;
                if (_currentNum > heroTxtBox.children.length-2) {
                    clearInterval(_txtInterval);
                    _txtTime = setTimeout(function() {
                        if (_noVideo)
                            clearTimeout(this);

                        for(i=0; i<heroTxtBox.children.length-1; i++)
                            removeClassName(heroTxtBox.children[i], 'effect');
        
                        for(i=0; i<heroTxts.children.length; i++) {
                            heroTxts.children[i].style.top = 50 + 'px';
                            heroTxts.children[i].style.opacity = 0;
                            heroTxts.children[i].style.display = 'none';
                        }

                        heroAnimation();
                    }, 3000);
                }
            }, 2000);
        }

        
    }

    var Sizing = function(videoEl, bgBox, txtBox) {
        var pastWindowW = _windowW;

        _windowW = window.innerWidth;
        _windowH = window.innerHeight;


        var heroTxts = txtBox.lastElementChild;

        if (_newWindow) {
            TweenMax.to(txtBox.children[0], 1, {delay:0.3, top:0, opacity:1, ease:Power2.easeOut});
            TweenMax.to(txtBox.children[1], 1, {delay:0.4, top:0, opacity:1, ease:Power2.easeOut});
            TweenMax.to(txtBox.children[2], 1, {delay:0.5, top:0, opacity:1, ease:Power2.easeOut});
        }

        if (_windowW > 1024) {
            for (i=0; i<bgBox.children.length; i++)
                bgBox.children[i].style.opacity = 0;

            for(i=0; i<txtBox.children.length-1; i++)
                removeClassName(txtBox.children[i], 'effect');

            for(i=0; i<heroTxts.children.length; i++) {
                heroTxts.children[i].style.top = 50 + 'px';
                heroTxts.children[i].style.opacity = 0;
                heroTxts.children[i].style.display = 'none';
            }
            videoEl.play();

            // heroAnimation start
            clearTimeout(_videoTime);
            clearInterval(_txtInterval);
            clearTimeout(_txtTime);
            heroAnimation();
        }
        else if (_newWindow || pastWindowW > 1024 && _windowW != pastWindowW) {
            _noVideo = true;
            
            // clear scheduler
            clearTimeout(_videoTime);
            clearInterval(_txtInterval);
            clearTimeout(_txtTime);

            videoEl.pause();
            bgBox.firstElementChild.style.opacity = 1;
            
            removeClassName(txtBox.firstElementChild, 'effect');
            for(i=1; i<txtBox.children.length-1; i++) {
                addClassName(txtBox.children[i], 'effect');
                heroTxts.children[i].style.display = 'none';
            }

            heroTxts.firstElementChild.style.display = 'block';
            TweenMax.to(heroTxts.firstElementChild, 1, {delay:0.7, top:0, opacity:1, ease:Power3.easeOut});
        }

        if (_windowW > 768) txtBox.style.top = Math.floor(_windowH/2 - (txtBox.offsetHeight/2)) + 'px';
        else txtBox.style.top = 120 + 'px';
    }

    return {
        init: function() {
            var heroVideo = document.getElementById('hero-video');
            var bgBox = document.getElementsByClassName('bg-box')[0];
            var heroTxtBox = document.getElementsByClassName('hero-txt-box')[0];

            Sizing(heroVideo, bgBox, heroTxtBox);
            _newWindow = false;
        },

        resizeEvt: function() {
            var heroVideo = document.getElementById('hero-video');
            var bgBox = document.getElementsByClassName('bg-box')[0];
            var heroTxtBox = document.getElementsByClassName('hero-txt-box')[0];

            window.addEventListener('resize', () => {
                Sizing(heroVideo, bgBox, heroTxtBox);
            });
        },

        mouseEvt: function() {
            var heroVideo = document.getElementById('hero-video');
            var heroTxtBoxA = document.getElementsByClassName('hero-txt-box')[0];
            var i = 0;

            while(heroTxtBoxA.children[i] != heroTxtBoxA.lastElementChild) {
                var el = heroTxtBoxA.children[i];

                el.addEventListener('mouseenter', function() {
                    var index = getIndex(this);
                    var otherIndex = [((index+1) > 2) ? 0 : index+1, ((index-1) < 0) ? 2 : index-1];
                    var parent = this.parentNode;
                    var bgBox = document.getElementsByClassName('bg-box')[0];
                    var heroTxts = document.getElementsByClassName('hero-txts')[0];

                    if(window.innerWidth > 1024) {
                        // clear scheduler
                        clearTimeout(_videoTime);
                        clearInterval(_txtInterval);
                        clearTimeout(_txtTime);

                        heroVideo.pause();
                    }

                    removeClassName(parent.children[index], 'effect');
                    for(j=0; j<otherIndex.length; j++) {
                        addClassName(parent.children[otherIndex[j]], 'effect');
                        // heroTxts.children[otherIndex[j]].style.top = 50 + 'px';
                        // heroTxts.children[otherIndex[j]].style.opacity = 1;
                        TweenMax.to(heroTxts.children[otherIndex[j]], 0, {top:50, opacity:0, ease:Power3.easeOut});
                        heroTxts.children[otherIndex[j]].style.display = "none";
                        TweenMax.to(bgBox.children[otherIndex[j]], 0.8, {opacity:0, ease:Power3.easeOut});
                    }

                    TweenMax.to(bgBox.children[index], 0.8, {opacity:1, ease:Power3.easeOut});
                    heroTxts.children[index].style.display = "block";
                    TweenMax.to(heroTxts.children[index], 0.5, {top:0, opacity:1, ease:Power3.easeOut});
                });

                el.addEventListener('mouseleave', function() {
                    var index = getIndex(this);
                    var otherIndex = [((index+1) > 2) ? 0 : index+1, ((index-1) < 0) ? 2 : index-1];
                    var parent = this.parentNode;
                    var bgBoxImg = document.getElementsByClassName('bg-box')[0].children[index];
                    var heroTxtsTxt = document.getElementsByClassName('hero-txts')[0].children[index];
                    
                    if (window.innerWidth > 1024) {
                        TweenMax.to(heroTxtsTxt, 0, {top:50, opacity:0, ease:Power3.easeOut});
                        heroTxtsTxt.style.display = "none";
                        TweenMax.to(bgBoxImg, 0.8, {opacity:0, ease:Power3.easeOut});
                        removeClassName(parent.children[otherIndex[0]], 'effect');
                        removeClassName(parent.children[otherIndex[1]], 'effect');
                        heroVideo.play();

                        // heroAnimation restart
                        clearTimeout(_videoTime);
                        clearInterval(_txtInterval);
                        clearTimeout(_txtTime);
                        heroAnimation();
                    }
                });

                i++;
            }
        }
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    mainPage.init();
});

window.addEventListener('load', function() {
    mainPage.resizeEvt();
    mainPage.mouseEvt();
})