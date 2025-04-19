map.on('popupopen', function (e) {
    console.log('Popup opened!', e);
    var modal = document.getElementById("modal");

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    var img = document.getElementById("myImg");
    var modalImg = document.getElementById("img-modal");
    var captionText = document.getElementById("caption");
    img.onclick = function(){
        modal.style.display = "block";
        modalImg.src = this.src;
        captionText.innerHTML = this.alt;
    }

    modal.addEventListener('click', function (e) {
        // Close only if you clicked *on the overlay*, not inside the modal
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // e.popup is the actual popup object
    // e.target is the map or the marker that triggered it
});// Get the modal
