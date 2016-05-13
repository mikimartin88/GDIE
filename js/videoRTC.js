window.addEventListener('DOMContentLoaded', function() {
   var v = document.getElementById('miVideo');
   navigator.getUserMedia = (navigator.getUserMedia || 
                             navigator.webkitGetUserMedia || 
                             navigator.mozGetUserMedia || 
                             navigator.msGetUserMedia);
   if (navigator.getUserMedia) {
      // Request access to video only
      navigator.getUserMedia(
         {
            video:true,
            audio:false
         },        
         function(stream) {
            var url = window.URL || window.webkitURL;
            v.src = url ? url.createObjectURL(stream) : stream;
            v.play();
         },
         function(error) {
            alert('Something went wrong. (error code ' + error.code + ')');
            return;
         }
      );
   }
   else {
      alert('Sorry, the browser you are using doesn\'t support getUserMedia');
      return;
   }
});