$('#instructions').popover();
$('#newgame').click(function() {
    var clickedTile = null;
    stopTimer();
    var clickedimg = null;
    var click = 0;
    var remaining = 8;
    var attempts = 0;
    var startTime = _.now();
    var timer;
    function stopTimer() {
        window.clearInterval(timer);
    }
    $(document).ready(function() {
        timer =window.setInterval(onTimer, 1000);
        function onTimer() {
            var elapsedSeconds = Math.floor((_.now() - startTime) / 1000);
            $('#elapsed-seconds').text("Time: "+elapsedSeconds);
            if(remaining == 0) {
                stopTimer();
            }
        }
        //new game goes inside this
        $('#game-board').empty();
        var tiles = [];
        var idx;
        for(idx = 1; idx <= 14; ++idx) {
            tiles.push({
                tileNum: idx,
                src: 'img/tile' + idx + '.jpg',
                flipped: false
            });
        }

        var shuffledTiles = _.shuffle(tiles);

        var selectedTiles = shuffledTiles.slice(0,8);

        var tilePairs = [];
        _.forEach(selectedTiles, function(tile) {
           tilePairs.push(_.clone(tile));
           tilePairs.push(_.clone(tile));
        });
        console.log(tilePairs);
        tilePairs = _.shuffle(tilePairs);

        var gameBoard = $('#game-board');
        var row = $(document.createElement('div'));
        var img;
        _.forEach(tilePairs, function(tile, elemIndex){
            if(elemIndex > 0 && !(elemIndex % 4)) {
                gameBoard.append(row);
                row = $(document.createElement('div'));
            }
            img = $(document.createElement('img'));
            img.attr({
                src: 'img/tile-back.png',
                alt: 'image of tile ' + tile.tileNum
            });
            img.data('tile', tile);
            row.append(img);
        });
        gameBoard.append(row);
        $('#game-board img').click(function() {
            if(click < 2) {
                var img = $(this);
                var tile = img.data('tile');
                if(!tile.flipped) {
                    img.fadeOut(100, function() {
                        if(clickedimg == null && clickedTile == null) {
                            click++;
                            console.log(click);
                            img.attr('src', tile.src);
                            clickedimg = $(this);
                            clickedTile = clickedimg.data('tile');
                            clickedimg.attr('src', clickedTile.src)
                            clickedTile.flipped = !clickedTile.flipped;
                        }
                        else if(clickedTile != tile) {
                            click++;
                            img.attr('src', tile.src);
                            tile.flipped = !tile.flipped;
                            if(clickedTile.tileNum == tile.tileNum) {
                                document.getElementById('right').play();
                                clickedimg = null;
                                clickedTile = null;
                                click = 0;
                                remaining--;
                            }
                            else {
                                    tile.flipped = false;
                                    clickedTile.flipped = false;
                                    attempts++;
                                    setTimeout(function(){
                                        document.getElementById('wrong').play();
                                        img.attr('src', 'img/tile-back.png');
                                        clickedimg.attr('src', 'img/tile-back.png');
                                        clickedimg = null;
                                        clickedTile = null;
                                        click = 0;
                                    }, 1000);
                            }
                        }
                        img.fadeIn(100);
                        $('#matches').text(8-remaining);
                        $('#tiles-remaining').text(remaining);
                        $('#attempts').text(attempts); 
                        if(remaining == 0) {
                            stopTimer();
                            document.getElementById('theme').play();
                            alert("You Won! You are the danger");
                        }
                    }); 
                }
            }
        });
    });
});
