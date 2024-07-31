
var inputId = '';
var textId = '';
function uploadFile(element) {
    var uploadButtonId = $(element).attr("id");
    inputId = 'fileInput' + uploadButtonId.slice(-1);
    textId = 'textInput' + uploadButtonId.slice(-1);
    $("#" + inputId).click();
}
async function uploadInputFileToS3(element) {
    var file = element.files[0];
    let result = await getUrl();
    var uploadUrl = result.data.url;
    var objectName = result.data.objectName;
    var formsData = result.data.formsData;
    const formData = new FormData();
    for (const [key, value] of Object.entries(formsData)) {
        {
            formData.append(key, value);
        }
    }
    formData.append('file', file);
    var settings = {
        "url": uploadUrl,
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": formData
    };
    $.ajax({
        url: uploadUrl,
        type: "POST",
        timeout: 0,
        processData: false,
        mimeType: "multipart/form-data",
        contentType: false,
        data: formData,

        success: function () {
            console.log('Upload S3 thành công!')
        },
        error: function (error) {
            console.log(`Error ${error}`);
        }
    });

    var fileInputId = $(element).attr("id");
    inputId = 'fileInput' + fileInputId.slice(-1);
    textId = 'textInput' + fileInputId.slice(-1);
    $('#' + textId).val(objectName);
}
async function getUrl() {
    return new Promise((resolve, reject) => {
        $.ajax({
            // Our sample url to make request
            url: `${$("#manager-domain").val()}/S3/TempUploadUrl`,

            // Type of Request
            type: "GET",

            // Function to call when to request is ok
            success: function (data) {
                resolve(data);
            },

            // Error handling
            error: function (error) {
                console.log(`Error ${error}`);
                reject(error);
            }
        });
    });
}