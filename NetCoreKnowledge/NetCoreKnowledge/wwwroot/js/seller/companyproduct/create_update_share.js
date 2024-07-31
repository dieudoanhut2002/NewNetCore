$(document).ready(function () {
    console.log("ĐÃ CHẠY");

    // Xử lý cho thẻ select chọn CompanyUnit
    var selectComUnit = $('#mySelect');
    var selectComUnitOption = selectComUnit.find("option");
    if (!selectComUnitOption.value) {
        CallAjax("GET", '/CompanyProduct/GetCompanyUnit', {
            ID: selectComUnitOption.text(),
        }, function (response) {
            console.log(response);
            selectComUnitOption.val(response.data.items[0].id);
            selectComUnitOption.text(response.data.items[0].name);
            selectComUnit.select2({
                placeholder: 'Chọn đơn vị tính bằng nhập từ khóa',
                ajax: {
                    url: '/CompanyProduct/GetCompanyUnit', // Địa chỉ endpoint AJAX
                    dataType: 'json',
                    delay: 250,
                    type: 'GET',
                    data: function (params) {
                        var query = {
                            KeyWord: params.term,
                        }

                        // Query parameters will be ?search=[term]&type=public
                        return query;
                    },
                    processResults: function (data) {
                        return {
                            results: $.map(data.data.items, function (obj) {
                                obj.id = obj.id || obj.pk; // replace pk with your identifier
                                obj.text = obj.name; // replace name with the property used for the text
                                return obj;
                            })
                        };
                    }
                }
            });
            selectComUnit.val(response.data.items[0].id).trigger("change");
        })
    }
    selectComUnit.select2({
        placeholder: 'Chọn đơn vị tính bằng nhập từ khóa',
        ajax: {
            url: '/CompanyProduct/GetCompanyUnit', // Địa chỉ endpoint AJAX
            dataType: 'json',
            delay: 250,
            type: 'GET',
            data: function (params) {
                var query = {
                    KeyWord: params.term,
                }

                // Query parameters will be ?search=[term]&type=public
                return query;
            },
            processResults: function (data) {
                return {
                    results: $.map(data.data.items, function (obj) {
                        obj.id = obj.id || obj.pk; // replace pk with your identifier
                        obj.text = obj.name; // replace name with the property used for the text
                        return obj;
                    })
                };
            }
        }
    });

    // Xử lý cho thẻ select chọn CompanyTaxRate

    var selectComTaxRate = $('#mySelect2');
    var selectComTaxRateOption=  selectComTaxRate.find("option");
    if (!selectComTaxRateOption.value) {
        CallAjax("GET", '/CompanyProduct/GetCompanyTaxRate', {
            ID: selectComTaxRateOption.text(),
        }, function (response) {
            console.log(response);
            selectComTaxRateOption.val(response.data.items[0].id);
            selectComTaxRateOption.text(response.data.items[0].taxName);
            selectComTaxRate.select2({
                placeholder: 'Chọn đơn vị tính bằng nhập từ khóa',
                ajax: {
                    url: '/CompanyProduct/GetCompanyTaxRate', // Địa chỉ endpoint AJAX
                    dataType: 'json',
                    delay: 250,
                    type: 'GET',
                    data: function (params) {
                        var query = {
                            KeyWord: params.term,
                        }

                        // Query parameters will be ?search=[term]&type=public
                        return query;
                    },
                    processResults: function (data) {
                        return {
                            results: $.map(data.data.items, function (obj) {
                                obj.id = obj.id || obj.pk; // replace pk with your identifier
                                obj.text = obj.taxName; // replace name with the property used for the text
                                return obj;
                            })
                        };
                    }
                }
            });
            selectComTaxRate.val(response.data.items[0].id).trigger("change");
        })
    }
    selectComTaxRate.select2({
        placeholder: 'Chọn đơn vị tính bằng nhập từ khóa',
        ajax: {
            url: '/CompanyProduct/GetCompanyTaxRate', // Địa chỉ endpoint AJAX
            dataType: 'json',
            delay: 250,
            type: 'GET',
            data: function (params) {
                var query = {
                    KeyWord: params.term,
                }

                // Query parameters will be ?search=[term]&type=public
                return query;
            },
            processResults: function (data) {
                return {
                    results: $.map(data.data.items, function (obj) {
                        obj.id = obj.id || obj.pk; // replace pk with your identifier
                        obj.text = obj.taxName; // replace name with the property used for the text
                        return obj;
                    })
                };
            }
        }
    });
});
// Xử lý làm tròn 2 chữ số
DecimalMaskForInput(20, 2, "#priceUpdateInput");