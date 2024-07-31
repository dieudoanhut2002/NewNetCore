$("[type-control=day-month-quarter-year]").on("select2:select", function (e) {
    var $this = $(this);
    var value = $this.val();
    $(".type-year,.type-month,.type-quarter,.type-day").attr("auto-hidden", "True");
    switch (value)
    {
        case "1":
            $(".type-day").attr("auto-hidden", "False");
            console.log(1);
            break;
        case "2":
            $(".type-year,.type-month").attr("auto-hidden", "False");
            console.log(2);
            break;
        case "3":
            $(".type-year,.type-quarter").attr("auto-hidden", "False");
            console.log(3);
            break;
    }
})
$("[type-control=day-month-quarter-year]").trigger("select2:select");