
function cargarMultimedia(nombre) {
    video = document.getElementById("miVideo"); 
    
    //video.textTracks.cues[0] = "";
    ficheroSubtitulos = document.getElementById(("ficheroSub"));
    var nombreAux = ficheroSubtitulos.src.indexOf(nombre) > -1
    ficheroSubtitulos.src = "media/" + nombre + ".vtt";
  
    //video.textTracks[1].mode ="hidden";
    var canvas = document.getElementById("canvasMod");
    var botonesCanvas = document.getElementById("botones");
    canvas.hidden = false;
    botonesCanvas.hidden = false;
    ficheroVideo = document.getElementById("ficheroVideo");
    ficheroVideo2 = document.getElementById("ficheroVideo2");
    ficheroVideo3 = document.getElementById("ficheroVideo3");
    ficheroVideo.src = "media/" + nombre + ".mp4";
    ficheroVideo2.src = "media/" + nombre + ".ogg";
    ficheroVideo3.src = "media/" + nombre + ".webm";

    video.load();
 if (!nombreAux && video.textTracks[0].cues.length >0){
    video.textTracks[0].removeCue(video.textTracks[0].cues[0]);
    video.textTracks[0].removeCue(video.textTracks[0].cues[0]);
    video.textTracks[0].removeCue(video.textTracks[0].cues[0]);
   }
    $.ajax({
        url: "media/" + nombre + ".txt",
        dataType: "text",
        success: function (data) {
            $("#descripcion").html(data);
        }
    });
}
$(document).ready(function () {
    //INITIALIZE
    var video = $('#miVideo');


    video[0].removeAttribute("controls");//Elimina los botones del video
    //Cuando se carguen los metadatos
    video.on('loadedmetadata', function () {

        $('.control').show().css({'bottom': -45}); //muestra los controles personalizados
        $('.loading').fadeIn(500); //muestra el gif de carga
        //Inicializa relojes del video
        $('.current').text(timeFormat(0));// 00:00
        $('.duration').text(timeFormat(video[0].duration));
        updateVolume(0, 0.7);

        //start to get video buffering data 
        setTimeout(startBuffer, 150);

        //bind video events
        $('.videoContainer')
                .append('<div id="init"></div>')
                .hover(function () {
                    $('.control').stop().animate({'bottom': 0}, 500);

                }, function () {
                    if (!volumeDrag && !timeDrag) {
                        $('.control').stop().animate({'bottom': -45}, 500);

                    }
                })
                .on('click', function () {
                    $('#init').remove();
                    $('.btnPlay').addClass('paused');
                    $(this).unbind('click'); //eliminamos evento sobre el contenedor de video
                    video[0].play();
                });
        $('#init').fadeIn(200);


    });

    //Muestra progreso de carga
    var startBuffer = function () {
        var bufferActual = video[0].buffered.end(0);
        var duracionMaxima = video[0].duration;
        var porcentaje = 100 * bufferActual / duracionMaxima;
        $('.bufferBar').css('width', porcentaje + '%');

        if (bufferActual < duracionMaxima) {
            setTimeout(startBuffer, 500);
        }
    };

    //Muestra tiempo actual de reproducción y la barra de reproducción
    video.on('timeupdate', function () {
        var currentPos = video[0].currentTime;
        var duracionMaxima = video[0].duration;
        var porcentaje = 100 * currentPos / duracionMaxima;
        $('.timeBar').css('width', porcentaje + '%');
        $('.current').text(timeFormat(currentPos));
    });

    //CONTROLS EVENTS
    //Pantalla clickada
    //boton play clickado
    video.on('click', function () {
        playpause();
    });
    $('.btnPlay').on('click', function () {
        playpause();
    });
    var playpause = function () {
        if (video[0].paused || video[0].ended) {
            $('.btnPlay').addClass('paused');
            video[0].play();

        } else {
            $('.btnPlay').removeClass('paused');
            video[0].pause();

        }
    };

    //boton cambio velocidad clickado
    $('.btnx1').on('click', function () {
        fastfowrd(this, 1);
    });
    $('.btnx3').on('click', function () {
        fastfowrd(this, 3);
    });
    $('.btnx5').on('click', function () {
        fastfowrd(this, 5);
    });
    var fastfowrd = function (obj, spd) {
        $('.text').removeClass('selected');
        $(obj).addClass('selected');
        video[0].playbackRate = spd;
        video[0].play();
    };

    //Parar video
    $('.btnStop').on('click', function () {
        $('.btnPlay').removeClass('paused');
        updatebar($('.progress').offset().left);
        video[0].pause();
    });

    //Botón de pantalla completa clickado
    $('.btnFS').on('click', function () {
        
        if (video[0].requestFullscreen) {
          video[0].requestFullscreen();
        } else if (video[0].msRequestFullscreen) {
          video[0].msRequestFullscreen();
        } else if (video[0].mozRequestFullScreen) {
          video[0].mozRequestFullScreen();
        } else if (video[0].webkitRequestFullscreen) {
          video[0].webkitRequestFullscreen();
        }
    });

    //Boton Apaga luz
    $('.btnLight').click(function () {
        $(this).toggleClass('lighton');

        if (!$(this).hasClass('lighton')) {
            $('body').append('<div class="overlay"></div>');
            $('.overlay').css({
                'position': 'absolute',
                'width': 100 + '%',
                'height': $(document).height(),
                'background': '#000',
                'opacity': 0.9,
                'top': 0,
                'left': 0,
                'z-index': 999
            });
            $('.videoContainer').css({
                'z-index': 1000
            });
        }
        //if lighton, remove overlay
        else {
            $('.overlay').remove();
        }
    });

    //Botón de sonido
    $('.sound').click(function () {
        video[0].muted = !video[0].muted;
        $(this).toggleClass('muted');
        if (video[0].muted) {
            $('.volumeBar').css('width', 0);
        } else {
            $('.volumeBar').css('width', video[0].volume * 100 + '%');
        }
    });

    //VIDEO EVENTS
    //Cuando el video se pueda empezar a reproducir
    video.on('canplay', function () {
        $('.loading').fadeOut(100);
    });

    //Cuando el video esté completamente cargado
    var completeloaded = false;
    video.on('canplaythrough', function () {
        completeloaded = true;
    });

    //Cuando el video se finalice
    video.on('ended', function () {
        $('.btnPlay').removeClass('paused');
        video[0].pause();
    });

    //video seeking event
    video.on('seeking', function () {
        //Si el video no está completamente cargado se muestra la barra de carga
        if (!completeloaded) {
            $('.loading').fadeIn(200);
        }
    });

    //video seeked event
    video.on('seeked', function () { });

    //Video necesita guardar la siguiente frame antes que se pueda empezar a reproducir
    video.on('waiting', function () {
        $('.loading').fadeIn(200);
    });

    //VIDEO PROGRESS BAR
    //Cuando se clicke la barra de progreso
    var timeDrag = false;
    $('.progress').on('mousedown', function (e) {
        timeDrag = true;
        updatebar(e.pageX);
    });
    $(document).on('mouseup', function (e) {
        if (timeDrag) {
            timeDrag = false;
            updatebar(e.pageX);
        }
    });
    $(document).on('mousemove', function (e) {
        if (timeDrag) {
            updatebar(e.pageX);
        }
    });
    var updatebar = function (x) {
        video[0].pause();
        var progress = $('.progress');

        //calcula donde se ha clickado y actualiza el current time del video
        var duracionMaxima = video[0].duration;
        var position = x - progress.offset().left;
        var porcentajeVar = 100 * position / progress.width();
        if (porcentajeVar > 100) {
            porcentajeVar = 100;
        }
        if (porcentajeVar < 0) {
            porcentajeVar = 0;
        }
        $('.timeBar').css('width', porcentajeVar + '%');
        var currentTimeVar = (duracionMaxima * porcentajeVar / 100);
        video[0].currentTime = currentTimeVar;
        video[0].play();

    };

    //Barra de Volumen
    //Control barra de volumen 
    var volumeDrag = false;
    $('.volume').on('mousedown', function (e) {
        volumeDrag = true;
        video[0].muted = false;
        $('.sound').removeClass('muted');
        updateVolume(e.pageX);
    });
    $(document).on('mouseup', function (e) {
        if (volumeDrag) {
            volumeDrag = false;
            updateVolume(e.pageX);
        }
    });
    $(document).on('mousemove', function (e) {
        if (volumeDrag) {
            updateVolume(e.pageX);
        }
    });
    var updateVolume = function (x, vol) {
        var volume = $('.volume');
        var porcentajeVar;
        //if only volume have specificed
        //then direct update volume
        if (vol) {
            porcentajeVar = vol * 100;
        } else {
            var position = x - volume.offset().left;
            porcentajeVar = 100 * position / volume.width();
        }

        if (porcentajeVar > 100) {
            porcentajeVar = 100;
        }
        if (porcentajeVar < 0) {
            porcentajeVar = 0;
        }

        //Actualiza barra de volumen y volumen
        $('.volumeBar').css('width', porcentajeVar + '%');
        video[0].volume = porcentajeVar / 100;//actualiza el volumen del video

        //Cambia el icono de sonido dependiendo de la barra de volumen
        if (video[0].volume == 0) {
            $('.sound').removeClass('sound2').addClass('muted');
        } else if (video[0].volume > 0.5) {
            $('.sound').removeClass('muted').addClass('sound2');
        } else {
            $('.sound').removeClass('muted').removeClass('sound2');
        }

    };

    //Conversor al formato de tiempo - 00:00
    var timeFormat = function (seconds) {
        //si m o s <10 añade un 0
        var m = Math.floor(seconds / 60) < 10 ? "0" + Math.floor(seconds / 60) : Math.floor(seconds / 60);  //devuelve los minutos redondeando los calculos por abajo
        var s = Math.floor(seconds - (m * 60)) < 10 ? "0" + Math.floor(seconds - (m * 60)) : Math.floor(seconds - (m * 60));
        return m + ":" + s;
    };
});