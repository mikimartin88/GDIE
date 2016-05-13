
document.addEventListener('DOMContentLoaded', function () {

    var videoOriginal = document.getElementById("miVideo");
    var canvas = document.getElementById("canvasMod");
    var botonesCanvas = document.getElementById("botones");
    var context = canvas.getContext('2d');
    var back = document.createElement('canvas');
    var backcontext = back.getContext('2d');
    var alturaVideo, anchuraVideo;

    alturaVideo = videoOriginal.clientWidth;
    anchuraVideo = videoOriginal.clientHeight;
    canvas.width = alturaVideo;
    canvas.height = anchuraVideo;
    back.width = alturaVideo;
    back.height = anchuraVideo;
    var modo = "";

    window.addEventListener("resize", function () {
        alturaVideo = videoOriginal.clientHeight;
        anchuraVideo = videoOriginal.clientWidth;
        canvas.height = videoOriginal.clientHeight;
        canvas.width = videoOriginal.clientWidth;
        back.height = videoOriginal.clientHeight;
        back.width = videoOriginal.clientWidth;
    }, 0);

    $('.canvasBtn').click(function () {        
        modo = $(this).attr("id");
        if (modo != "") {
            switch (modo) {
                case "btnOriginal":
                    drawOriginal(videoOriginal, context, backcontext, videoOriginal.clientWidth, videoOriginal.clientHeight);
                    break;
                case "btnBlanco":
                    drawBlancoNegro(videoOriginal, context, backcontext, videoOriginal.clientWidth, videoOriginal.clientHeight);
                    break;
                case "btnSipi":
                    drawSepia(videoOriginal, context, backcontext, videoOriginal.clientWidth, videoOriginal.clientHeight);
                    break;
                case "btnInvertido":
                    drawColoresInvertidos(videoOriginal, context, backcontext, videoOriginal.clientWidth, videoOriginal.clientHeight);
                    break;
                case "btn2Canales":
                    draw2Canales(videoOriginal, context, backcontext, videoOriginal.clientWidth, videoOriginal.clientHeight);
                    break;
            }
        }
    });
 

   

    function getWidth(v) {
        return v.clientWidth;
    }
    function getHeight(v) {
        return v.clientHeight;
    }

    function drawOriginal(v, c, bc, anchuraVideo, alturaVideo) {
        
        if (v.paused || v.ended)
            return false;

        bc.drawImage(v, 0, 0, anchuraVideo, alturaVideo);

        var idata = bc.getImageData(0, 0, anchuraVideo, alturaVideo);
        var data = idata.data;

        idata.data = data;
      
        c.putImageData(idata, 0, 0);

        setTimeout(function () {
            drawOriginal(v, c, bc, getWidth(v), getHeight(v));
        }, 0);
    }

    function drawBlancoNegro(v, c, bc, anchuraVideo, alturaVideo) {
        if (v.paused || v.ended)
            return false;

        bc.drawImage(v, 0, 0, anchuraVideo, alturaVideo);
    
        var idata = bc.getImageData(0, 0, anchuraVideo, alturaVideo);
        var data = idata.data;
        
        for (var i = 0; i < data.length; i += 4) {
            var r = data[i];
            var g = data[i + 1];
            var b = data[i + 2];
            var brightness = (3 * r + 4 * g + b) >>> 3;
            data[i] = brightness;
            data[i + 1] = brightness;
            data[i + 2] = brightness;
        }
        idata.data = data;
 
        c.putImageData(idata, 0, 0);
     
        setTimeout(function () {
            drawBlancoNegro(v, c, bc, getWidth(v), getHeight(v));
        }, 0);
    }
    function drawColoresInvertidos(v, c, bc, anchuraVideo, alturaVideo) {
        if (v.paused || v.ended) {
            return false;
        }

        bc.drawImage(v, 0, 0, anchuraVideo, alturaVideo);
        var apx = bc.getImageData(0, 0, anchuraVideo, alturaVideo);
        var data = apx.data;

        
        for (var i = 0; i < data.length; i += 4)
        {
            var r = data[i],
                    g = data[i + 1],
                    b = data[i + 2];
            data[i] = 255 - r;
            data[i + 1] = 255 - g;
            data[i + 2] = 255 - b;
        }
        apx.data = data;
        c.putImageData(apx, 0, 0);


        setTimeout(function () {
            drawColoresInvertidos(v, c, bc, getWidth(v), getHeight(v));
        }, 0);
    }
    function draw2Canales(v, c, bc, anchuraVideo, alturaVideo) {
        if (v.paused || v.ended) {
            return false;
        }

        bc.drawImage(v, 0, 0, anchuraVideo, alturaVideo);
        var apx = bc.getImageData(0, 0, anchuraVideo, alturaVideo);
        var data = apx.data;



      
        for (var i = 0; i < data.length; i += 4)
        {
            var r = data[i],
                    g = data[i + 1],
                    b = data[i + 2];
            data[i] = r;
            data[i + 1] = g;
            data[i + 2] = g;
        }
        apx.data = data;
        c.putImageData(apx, 0, 0);


        setTimeout(function () {
            draw2Canales(v, c, bc, getWidth(v), getHeight(v));
        }, 0);
    }
    function drawSepia(v, c, bc, anchuraVideo, alturaVideo) {
        if (v.paused || v.ended) {
            return false;
        }

        bc.drawImage(v, 0, 0, anchuraVideo, alturaVideo);
        var apx = bc.getImageData(0, 0, anchuraVideo, alturaVideo);
        var data = apx.data;

        for (var i = 0; i < data.length; i += 4)
        {
            var r = data[i],
                    g = data[i + 1],
                    b = data[i + 2];
            data[i] = (r * .393) + (g * .769) + (b * .189)
            data[i + 1] = (r * .349) + (g * .686) + (b * .168)
            data[i + 2] = (r * .272) + (g * .534) + (b * .131)
        }
        apx.data = data;
        c.putImageData(apx, 0, 0);
        setTimeout(function () {
            drawSepia(v, c, bc, getWidth(v), getHeight(v));
        }, 0);
    }

    
});
