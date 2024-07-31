$(document).ready(function () {
    console.log("ĐÃ CHẠY");

    $(".permissionID").change(function () {
        var dem = 0;
        $(".permissionID").each(function (index) {
            if ($(this).is(":checked")) {
                $(this).attr("name", `PermissionIDs[${dem}]`);
                dem++;
            }
            else {
                $(this).removeAttr("name");
            }
        });
    });
});
