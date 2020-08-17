// Modal Gallery
//Created by Deon van Zyl
// Note: this file needs some cleanup as there are parts of webservices tests in between
$(document).ready(function () {
    // Get and list items
    var ulmysiteImages = $('#ulmysiteImages');
    $('#btn').click(function () {
        $.ajax({
            type: 'Get',
            //url: 'api/AttendanceRegister',
            url: 'api/values',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                ulmysiteImages.empty();
                $.each(data, function (index, val) {
                    //var fullName = val.PictureTakenBy + '' + val.DateImageTaken;
                    //ulmysiteImages.append('<li>' + fullName + '</li>')

                    ulmysiteImages.append('- <a href="#" onClick="deleteitem(\'' + index + '\')" />Delete: </a>' + val + '<br>')
                });
            }
        })
    });

    // Delete Function
    function deleteitem(index) {
        $.ajax({
            type: 'DELETE',
            //url: 'api/AttendanceRegister',
            url: 'api/values/'.index,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                console.log("deleted: ".index);

            }
        })
    };
    // Clear List of Items
    $('#btnClear').click(function () {
        ulmysiteImages.empty();
    });
    // Upload a image

    $('#btnUploadFile').on('click', function () {

        var data = new FormData();

        var files = $("#fileUpload").get(0).files;

        // Add the uploaded image content to the form data collection
        if (files.length > 0) {
            data.append("UploadedImage", files[0]);
        }

        var files = document.getElementById("fileUpload").files;
        // Let's create an empty `errors` String to collect eventual errors into:
        var errors = "";

        if (!files) {
            errors += "File upload not supported by your browser.";
        }

        // Check for `files` (FileList) support and if contains at least one file:
        if (files && files[0]) {

            // Iterate over every File object in the FileList array
            for (var i = 0; i < files.length; i++) {

                // Let's refer to the current File as a `file` variable
                // https://developer.mozilla.org/en-US/docs/Web/API/File
                var file = files[i];
                console.log("Current file is: " + file.name);


                //testblob
                var wow = new Blob(['hello world'], { type: 'string/text' });

                var marker = {
                    "marker": [
                        {
                            Filestream: wow, Facility: "Facility", FacilityID: "12", DateImageTaken: "2019-01-01 12:00:00",
                            PictureTakenBy: "PictureTakenBy", ItemID: "1", Programme: "Programme", AttendanceDate: "2019-01-01"
                        }
                    ]
                };

                // Make Ajax request with the contentType = false, and procesDate = false
                var ajaxRequest = $.ajax({
                    type: "POST",
                    url: "/api/values/",
                    contentType: 'application/x-www-form-urlencoded',
                    accept: "application/json",
                    dataType: 'json',
                    // -- end temp

                    processData: false, // Preventing default data parse behavior

                    data: "=A test entry", // add an = sign for singular text value

                    success: function (response) {
                        document.getElementById("disp").innerHTML = response;
                    },
                    error: function () {
                        alert("error");
                    }
                });
            }
        }


        ajaxRequest.done(function (xhr, textStatus) {
            // Do other operation
        });

    });
    //-----------------------
    //Start - Preview Browse Image
    window.URL = window.URL || window.webkitURL;
    var elBrowse = document.getElementById("fileUpload"),
        elPreview = document.getElementById("preview"),
        useBlob = false && window.URL; // Set to `true` to use Blob instead of Data-URL

    // 2.
    function readImage(file) {

        // Create a new FileReader instance
        // https://developer.mozilla.org/en/docs/Web/API/FileReader
        var reader = new FileReader();

        // Once a file is successfully readed:
        reader.addEventListener("load", function () {

            // At this point `reader.result` contains already the Base64 Data-URL
            // and we've could immediately show an image using
            // `elPreview.insertAdjacentHTML("beforeend", "<img src='"+ reader.result +"'>");`
            // But we want to get that image's width and height px values!
            // Since the File Object does not hold the size of an image
            // we need to create a new image and assign it's src, so when
            // the image is loaded we can calculate it's width and height:
            var image = new Image();
            image.addEventListener("load", function () {

                // Concatenate our HTML image info
                var imageInfo = file.name + ' ' + // get the value of `name` from the `file` Obj
                    image.width + '×' + // But get the width from our `image`
                    image.height + ' ' +
                    file.type + ' ' +
                    Math.round(file.size / 1024) + 'KB';

                // Finally append our created image and the HTML info string to our `#preview`
                elPreview.appendChild(this);
                elPreview.insertAdjacentHTML("beforeend", imageInfo + '<br>');

                // If we set the variable `useBlob` to true:
                // (Data-URLs can end up being really large
                // `src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAA...........etc`
                // Blobs are usually faster and the image src will hold a shorter blob name
                // src="blob:http%3A//example.com/2a303acf-c34c-4d0a-85d4-2136eef7d723"
                if (useBlob) {
                    // Free some memory for optimal performance
                    window.URL.revokeObjectURL(image.src);
                }
            });

            image.src = useBlob ? window.URL.createObjectURL(file) : reader.result;

        });

        // https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
        reader.readAsDataURL(file);
    }

    // 1.
    // Once the user selects all the files to upload
    // that will trigger a `change` event on the `#browse` input
    elBrowse.addEventListener("change", function () {

        // Let's store the FileList Array into a variable:
        // https://developer.mozilla.org/en-US/docs/Web/API/FileList
        var files = this.files;
        // Let's create an empty `errors` String to collect eventual errors into:
        var errors = "";

        if (!files) {
            errors += "File upload not supported by your browser.";
        }

        // Check for `files` (FileList) support and if contains at least one file:
        if (files && files[0]) {

            // Iterate over every File object in the FileList array
            for (var i = 0; i < files.length; i++) {

                // Let's refer to the current File as a `file` variable
                // https://developer.mozilla.org/en-US/docs/Web/API/File
                var file = files[i];

                // Test the `file.name` for a valid image extension:
                // (pipe `|` delimit more image extensions)
                // The regex can also be expressed like: /\.(png|jpe?g|gif)$/i
                if ((/\.(png|jpeg|jpg|gif)$/i).test(file.name)) {
                    // SUCCESS! It's an image!
                    // Send our image `file` to our `readImage` function!
                    readImage(file);
                } else {
                    errors += file.name + " Unsupported Image extension\n";
                }
            }
        }

        // Notify the user for any errors (i.e: try uploading a .txt file)
        if (errors) {
            alert(errors);
        }

    });
    // ENd Preview Browse
    //----------------
});

// Start Gallery JS
$(window).on('load', function () {

    // Carousel Slider //

    let elemWidth = (100 * parseFloat($('.listBox li').css('width')) / parseFloat($('.containerBox').parent().css('width'))); // Width of each element
    let elemPerPage = parseInt((100 / elemWidth)); // Elements per page

    let marginLeft = 0;
    let count = 0;

    let totalElem = $('.listBox li').length; // Number of total elements
    let numSlides = Math.ceil(totalElem / elemPerPage); // Number of slides

    if (totalElem > elemPerPage) {

        $('.arrow.back').on('click', function () { // Go back

            if (marginLeft < 0) {

                count--;
                marginLeft = marginLeft + 100;

                $('ul.listBox').animate({
                    marginLeft: marginLeft + "%"
                }, 1500);

            }

        });

        $('.arrow.forward').on('click', function () { // Go forward

            count++;

            if (count < numSlides) {

                if (marginLeft <= 0) {

                    marginLeft = marginLeft - 100;

                    $('ul.listBox').animate({
                        marginLeft: marginLeft + "%"
                    }, 1500);

                }

            } else {

                count--;

            }

        });

    }

    // Open infoBox //

    for (let i = 0; i < $('.listBox li .content').length; i++) {

        $($('.listBox li .content')[i]).on('click', function () {

            $('.infoBox li').addClass("hidden");

            if ($($('.infoBox li')[i]).hasClass("hidden")) {

                $($('.infoBox li')[i]).removeClass("hidden");

            } else {

                $($('.infoBox li')[i]).addClass("hidden");

            }

        });

    }

});
                    // End Gallery JS