$("input:not(autocomplete)").attr("autocomplete", "off");
$('[addProductRow]').addEvent('click', function () {
    $(this).addRowProductTable();
});
$('[addrow]').addEvent("click",function () {
    $(this).addRow();
});
$('.remove-button').on('click', function () {
    $(this).removeRow();
});

jQuery.fn.extend({
    addRow: function () {
        this.removeSelect2();
        var tableId = "#" + $(this).attr("addRow");
        var table = $(tableId);
        var firstRow = table.find('tbody tr:first');
        var newRow = firstRow.clone();
        newRow.find('textarea,input').prop('checked', false).val("");
        newRow.appendTo(table);
        newRow.removeSelect2().addSelect2();
        newRow.decimalMaskForInput();
        table.updateRowNumbers();
        return newRow;
    },
    addRowProductTable: function () {
        this.removeSelect2();
        var tableId = "#" + $(this).attr("addProductRow");
        var table = $(tableId);
        var index = table.find("tbody tr.productRowIndex").length;
        var firstRow = table.find('tbody tr:first');
        var newRow = firstRow.clone();
        newRow.find('textarea,input').prop('checked', false).val("");

        newRow.find('.modalProduct').attr('data-bs-target', `#extendModal-${index}`);
        newRow.find('[id^="extendModal-"]').attr('id', `extendModal-${index}`).attr('aria-labelledby', `extendModalLabel-${index}`);
        newRow.find('[id^="extendProductsTable-"]').attr('id', `extendProductsTable-${index}`);
        var a = newRow.find('[addtable^="extendProductsTable-"]').attr('addtable', `extendProductsTable-${index}`);
        a.click(function () {
            var clone2 = $("#extendProductRowClone").clone();
            var productIndex = $('#productsTable tbody tr.genIndex').length;
            var extendProductIndex = $(`#extendProductsTable-${index} tbody tr.extendProductRow`).length;
            clone2.removeAttr('id');
            clone2.find('input.extendproductKey').attr('name', `InvVATExtend.Products[${productIndex - 1}].Extends[${extendProductIndex}].Key`);
            clone2.find('select.extendproductType ').attr('name', `InvVATExtend.Products[${productIndex - 1}].Extends[${extendProductIndex}].Type`);
            clone2.find('input.extendproductValue ').attr('name', `InvVATExtend.Products[${productIndex - 1}].Extends[${extendProductIndex}].Value`);
            clone2.appendTo($(`#extendProductsTable-${index}`));
            $(`#extendProductsTable-${index}`).updateRowNumbers();
        })

        newRow.appendTo(table);
        newRow.removeSelect2().addSelect2();
        newRow.decimalMaskForInput();
        table.updateRowNumberProduct();
    },
    removeRow: function () {
        var tableId = '#' + $(this).attr('removerow');
        var table = $(tableId);
        var rowCount = table.find(`tbody tr`).length;
        if (tableId == '#productsTable') {
            rowCount = table.find(`tbody tr.productRowIndex`).length;
        }
        if (rowCount > 1) {
            $(this).closest('tr').remove();
        }
        else {
            ShowToastError("Thông báo", "Bảng cần tối thiểu 1 dòng dữ liệu");
        }
        if (tableId == '#productsTable') {
            table.updateRowNumberProduct();
            table.find('.productTotalAmountAfterTax').trigger("change");
        } else {
            table.updateRowNumbers();
        }
    },
    updateRowNumbers: function () {
        this.find('tbody tr').each(function (index) {
            $(this).find('td:first').text(index + 1);
            $(this).find('input, select').each(function () {
                var name = $(this).attr('name');
                if (name) {
                    var newName = name.replace(/\[\d+\]/, '[' + index + ']');
                    $(this).attr('name', newName);
                }
            });
        });
        initEvent();
    },
    updateRowNumberProduct: function () {
        this.find('tbody tr.productRowIndex').each(function (index) {
            $(this).find('td:first').text(index + 1);
            $(this).find('input, select').each(function () {
                var name = $(this).attr('name');
                if (name) {
                    var newName = name.replace(/\[\d+\]/, '[' + index + ']');
                    $(this).attr('name', newName);
                }
            });
        });
        initEvent();
    },
});

//===================================================Tính giá trị cho bảng product-START=============

function calculatorProductTotalAmountBeforeDiscount($row)
{
    var productQuantity = parseFloat($row.find('.productQuantity').val()) || 0;
    var productPrice = parseFloat($row.find('.productPrice').val()) || 0;
    var productTotalAmountBeforeDiscount = 0;
    if (productQuantity != 0 && productPrice != 0) {
        productTotalAmountBeforeDiscount = productPrice * productQuantity;
    } else if (productQuantity == 0 && productPrice != 0) {
        productTotalAmountBeforeDiscount = productPrice;
    }
    return productTotalAmountBeforeDiscount;
}

function productTotalAmountBeforeDiscountDefault($row) {
    var quantity = parseFloat($row.find('.productQuantity').val()) || 0;
    var price = parseFloat($row.find('.productPrice').val()) || 0;
    var totalAmountBeforeDiscount = quantity * price;
    return totalAmountBeforeDiscount;
}  

function productDiscountAmountDefault($row) {
    var totalAmountBeforeDiscount = parseFloat($row.find('.productTotalAmountBeforeDiscount').val()) || 0;
    var discountRate = parseFloat($row.find('.productDiscountRate').val()) || 0;
    return totalAmountBeforeDiscount * (discountRate / 100);
}

function productTotalAmountBeforeTaxDefault($row) {
    var totalAmountBeforeDiscount = parseFloat($row.find('.productTotalAmountBeforeDiscount').val()) || 0;
    var discountAmount = parseFloat($row.find('.productDiscountAmount').val()) || 0;
    return totalAmountBeforeDiscount - discountAmount;
}

function productTaxAmountDefault($row) {
    var totalAmountBeforeTax = parseFloat($row.find('.productTotalAmountBeforeTax').val()) || 0;
    var taxRate = parseFloat($row.find('.productTaxRate').val()) || 0;
    if (taxRate == -1.00 || taxRate == -2.00) {
        taxRate = 0;
    }
    return totalAmountBeforeTax * (taxRate / 100);
}

function productTotalAmountAfterTaxDefault($row) {
    var totalAmountBeforeTax = parseFloat($row.find('.productTotalAmountBeforeTax').val()) || 0;
    var taxAmount = parseFloat($row.find('.productTaxAmount').val()) || 0;
    return totalAmountBeforeTax + taxAmount;
}




//===================================================Tự động thêm dòng cho bảng reports=========

///=======================================================Tính giá trị cho product-End===========================
//===================================================Tự động thêm dòng cho bảng reports=========


var initEvent = function () {
    $('#productsTable').find('.productQuantity, .productPrice').addEvent('change paste', function () {
        var $row = $(this).closest('tr');
        var result = calculatorProductTotalAmountBeforeDiscount($row);
        $row.find('.productTotalAmountBeforeDiscount')
            .val(result.GetText())
            .trigger("change");
    });
    $('#productsTable').find('.productDiscountRate, .productTotalAmountBeforeDiscount').addEvent('change paste', function () {
        var $row = $(this).closest('tr');
        var result = productDiscountAmountDefault($row);
        $row.find('.productDiscountAmount')
            .val(result.GetText())
            .trigger("change");
    });

    $('#productsTable').find('.productDiscountAmount').addEvent('change paste', function () {
        var $row = $(this).closest('tr');
        var result = productTotalAmountBeforeTaxDefault($row);
        $row.find('.productTotalAmountBeforeTax')
            .val(result.GetText())
            .trigger("change");
        $row.find(".productTaxRate").trigger("select2:select");
    });

    $('#productsTable').find('.productTaxRate').addEvent('select2:select', function () {

        var $row = $(this).closest('tr');
        var result = productTaxAmountDefault($row);

        $row.find('.productTaxAmount')
            .val(result.GetText())
            .trigger("change");
    });
    $('#productsTable').find('.productTotalAmountBeforeTax').addEvent('change paste', function () {

        var $row = $(this).closest('tr');
        var result = productTaxAmountDefault($row);

        $row.find('.productTaxAmount')
            .val(result.GetText())
            .trigger("change");
    });

    $('#productsTable').find('.productTaxAmount').addEvent('change paste', function () {
        var $row = $(this).closest('tr');
        var result = productTotalAmountAfterTaxDefault($row);

        $row.find('.productTotalAmountAfterTax')
            .val(result.GetText())
            .trigger("change");
    });
    $('#productsTable').find('.productTotalAmountAfterTax').addEvent('change paste', function () {
        var $table = $('#productsTable');
        var $rows = $table.find('tbody tr.productRowIndex');

        var result = [];

        $rows.each(function () {
            var $row = $(this);
            var productTaxRate = parseFloat($row.find('.productTaxRate').val());
            if ($row.find('.productTaxRate').val() == "") {
                productTaxRate = null;
            }
            var productTotalAmountBeforeTax = parseFloat($row.find('.productTotalAmountBeforeTax').val() || 0);
            var productTaxAmount = parseFloat($row.find('.productTaxAmount').val() || 0);
            var productTotalAmountAfterTax = parseFloat($row.find('.productTotalAmountAfterTax').val() || 0);
            var res = result.find(p => p.vat == productTaxRate);
            if (!res) {
                res = {
                    vat: productTaxRate,
                    productTotalAmountBeforeTax: 0,
                    productTaxAmount: 0,
                    productTotalAmountAfterTax: 0,
                };
                result.push(res)
            }
            res.productTotalAmountBeforeTax += productTotalAmountBeforeTax;
            res.productTaxAmount += productTaxAmount;
            res.productTotalAmountAfterTax += productTotalAmountAfterTax;
        });


        $('#reportsTable tbody').find('tr:not(:first)').remove();
        result.forEach(function (reportTaxRateValue, i) {
            var $newRow = $('#reportsTable tbody tr:first').clone();
            if (i === 0) {
                $newRow = $('#reportsTable tbody tr:first');
            } else {
                $newRow.appendTo($('#reportsTable tbody'));
            }
            $newRow.find('.reportTaxRateValue').val(null);
            if (reportTaxRateValue.vat != null) {
                $newRow.find('.reportTaxRateValue').val(parseFloat(reportTaxRateValue.vat).toFixed(2));
            }
            $newRow.find('.reportTaxAmount').val(parseFloat(reportTaxRateValue.productTaxAmount)).trigger("change");
            $newRow.find('.reportPreTaxAmount').val(parseFloat(reportTaxRateValue.productTotalAmountBeforeTax)).trigger("change");
            $newRow.find('.reportTotalAmount').val(parseFloat(reportTaxRateValue.productTotalAmountAfterTax)).trigger("change");
            $newRow.decimalMaskForInput();
            $newRow.autoTrim().decimalMaskForInput();
            $newRow.removeSelect2();
            $newRow.initSelect2Default()
                .then(() => {
                    $("*").addSelect2();
                });
            $newRow.find(".reportTaxRate").val($newRow.find('.reportTaxRateValue').val()).trigger("change");
        });

        //Tính tổng tiền chiết khấu cho hoá đơn
        var totalAmountOfTradeDiscount = 0;
        $rows.each(function () {
            var productDiscountAmount = parseFloat($(this).find('.productDiscountAmount').val()) || 0;
            totalAmountOfTradeDiscount += productDiscountAmount;
        });

        totalAmountOfTradeDiscount = parseFloat(totalAmountOfTradeDiscount);
        if (!isNaN(totalAmountOfTradeDiscount)) {
            if ($('#currency').val() === "VND") {
                totalAmountOfTradeDiscount = Math.round(totalAmountOfTradeDiscount);
            } else {
                totalAmountOfTradeDiscount = totalAmountOfTradeDiscount.toFixed(2);
            }
        }

        $('#totalAmountOfTradeDiscount').val(totalAmountOfTradeDiscount);
        $table.updateRowNumberProduct();
        $('#reportsTable').updateRowNumbers();
    });

    $("#productsTable").find(".productCharacteristic").addEvent('select2:select', function () {
        var $row = $(this).closest("tr");
        var productCharacteristic = $(this).val();
        switch (productCharacteristic) {
            case "1":
                $row.find('input, select, button').prop("disabled", false);
                $row.find('.productUnit').attr('require', "required");
                $row.find('.productTaxRate').attr('require', "required");
                $row.find('.productTaxRate').on('invalid', function () {
                    ShowToastError("Sai định dạng dữ liệu", "Vui lòng chọn mức thuế suất");
                })
                break;
            case "2":
                $row.find('input, select, button').prop("disabled", false);
                $row.find('.productUnit').attr('require', "required");
                $row.find('.productTaxRate').removeAttr("required");
                break;
            case "3":
                $row.find('.productUnit').removeAttr('required');
                $row.find('input, select, button').prop("disabled", false);
                $row.find('.productTaxRate').removeAttr("required");
                break;
            case "4":
                $row.find('input:not(.productName)').val('');
                $row.find('input:not(.productName), select:not(.productCharacteristic )').prop("disabled", true);
                $row.find('.productTaxRate').removeAttr("required");
                break;
            default:
                break;
        }
    });
    let companyProducts = [];
    $('#productsTable').find('.productCode').addEvent('input', function () {
        var $row = $(this).closest('tr');
        CallAjax('GET', '/CompanyProduct/SearchProductByCode', {
            SearchText: $(this).val(),
        }, function (response) {
            companyProducts = response.data.items;
        })
        $(this).attr("autocomplete", "on");

        $(this).autocomplete({
            source: companyProducts.map(c => c.code),
            select: function (event, ui) {
                const product = companyProducts.find(c => c.code === ui.item.value);
                if (product) {
                    $row.find(".productCode").val(product.code);
                    $row.find(".productName").val(product.name);
                    $row.find(".productPrice").val(product.price);
                    $row.find(".productUnit").val(product.companyUnitName);
                    $row.find(".productTaxRateValue").val(parseFloat(product.companyTaxRateTaxRate).toFixed(2))
                    $row.initSelect2Default();
                }
            }
        })

        $(this).attr("autocomplete", "off");
    });
    $(".remove-button").addEvent('click', function () {
        $(this).removeRow();
    })
};
initEvent();
$(".productTaxRate").trigger("select2:select");
//========================================Tính tổng tiền để gán vào các ô input-Start=====================


function totalAmountAfterTaxOnChange() {
    let totalPreTaxAmount = 0;
    let totalTaxAmount = 0;
    $('#reportsTable tbody tr').each(function () {
        let taxAmount = parseFloat($(this).find('.reportTaxAmount').val()) || 0;
        let preTaxAmount = parseFloat($(this).find('.reportPreTaxAmount').val()) || 0;

        let totalAmount = preTaxAmount + taxAmount;
        $(this).find('.reportTotalAmount').val(parseFloat(totalAmount)).trigger('change');
        totalTaxAmount += taxAmount;
        totalPreTaxAmount += preTaxAmount;
    });


    $('#preTaxAmount').val(totalPreTaxAmount.GetText());
    $('#taxAmount').val(totalTaxAmount.GetText());
}

$('#reportsTable').on('change paste', '.reportTaxAmount, .reportPreTaxAmount', function () {
    totalAmountAfterTaxOnChange();
});
$('#reportsTable').on('change paste', '.reportTotalAmount', function () {
    let totalTotalAmount = 0;
    $('#reportsTable tbody tr').each(function () {
        let totalAmount = parseFloat($(this).find('.reportTotalAmount').val()) || 0;
        totalTotalAmount += totalAmount;
    });

    $('#feesTable tbody tr').each(function () {
        let totalAmount = parseFloat($(this).find('.feeTotalAmount').val()) || 0;
        totalTotalAmount += totalAmount;
    });

    totalTotalAmount = parseFloat(totalTotalAmount);

    $('#totalAmountAfterTaxValue').val(totalTotalAmount).trigger("change");
});
$('#feesTable').on("change page", '.feeTotalAmount', function () {
    let totalTotalAmount = 0;
    $('#feesTable tbody tr').each(function () {
        let totalAmount = parseFloat($(this).find('.feeTotalAmount').val()) || 0;
        totalTotalAmount += totalAmount;
    });

    $('#reportsTable tbody tr').each(function () {
        let totalAmount = parseFloat($(this).find('.reportTotalAmount').val()) || 0;
        totalTotalAmount += totalAmount;
    });

    totalTotalAmount = parseFloat(totalTotalAmount);
    totalTotalAmount = parseFloat(totalTotalAmount);

    $('#totalAmountAfterTaxValue').val(totalTotalAmount).trigger("change");
});



function updateAmountInWords() {
    var currency = $('#currency').val();
    var number = $('#totalAmountAfterTax').val();

    if (!currency) {
        var $firstOption = $('#currency option:first');
        if ($firstOption.length > 0) {
            currency = $firstOption.val();
        }
    }
    var integerPart = $('option:selected', $("#currency")).attr('data-integer-part');
    var decimalPart = $('option:selected', $("#currency")).attr('data-decimal-part');
    var amountInWords = DocTienThanhChu(number, integerPart, decimalPart);
    $('#amountInWords').val(amountInWords);
}


$('#totalAmountAfterTaxValue').addEvent('change paste', function () {
    var totalAmountAfterTax = $('#totalAmountAfterTaxValue').val();
    var length = 2;
    if ($("#currency").val() == 'VND') {
        length = 0;

        $('#totalAmountAfterTax').val(parseFloat(totalAmountAfterTax).toFixed(length));
    }
    else {
        $('#totalAmountAfterTax').val(parseFloat(totalAmountAfterTax).toFixed(length));
    }
    updateAmountInWords();
});

$('#currency').addEvent('select2:select', function () {
    var totalAmountAfterTax = $('#totalAmountAfterTaxValue').val();
    var length = 2;
    if ($(this).val() == 'VND') {
        length = 0;

        $('#totalAmountAfterTax').val(parseFloat(totalAmountAfterTax).toFixed(length));
    }
    else {
        $('#totalAmountAfterTax').val(parseFloat(totalAmountAfterTax).toFixed(length));
    }
    updateAmountInWords();
    ///Đây là trigger để tính lại tất cả giá trị từ bảng products
    //$('#productsTable tbody tr .productQuantity').trigger("change");
});


////========================================Tính tổng tiền để gán vào các ô input tổng-END ==========================
//=====================================================Xử lý kiểu của value bảng extend khi chọn type===============
$('#extendsTable').on('change', 'select[name^="InvVATExtend.Extends["]', function () {
    var selectedType = $(this).val();
    var idPattern = /Extends\[(\d+)\]\.Type/;
    var match = idPattern.exec(this.name);

    if (match) {
        var index = match[1];
        var $inputField = $(`[name='InvVATExtend.Extends[${index}].Value']`);
        var validateTime = "yyyy-MM-ddTHH:mm";

        switch (selectedType) {
            case '1':
                $inputField.attr('type', 'text');
                break;
            case '2':
                $inputField.attr('type', 'number');
                break;
            case '3':
                $inputField.attr('type', 'date');
                break;
            case '4':
                $inputField.attr('type', 'datetime-local');
                break;
            case '5':
                $inputField.attr('type', 'boolean');
                break;
            default:
                $inputField.attr('type', 'text');
        }
    }
});

$('[id^="extendProductsTable-"]').on('change', 'select[name^="InvVATExtend.Products"][name*="Extends"][name$=".Type"]', function () {
    var selectedType = $(this).val(); // Lấy giá trị đã chọn trong select

    // Lấy id của bảng chứa select này
    var tableId = $(this).closest('table').attr('id');

    // Biểu thức chính quy để lấy thông tin về chỉ số của sản phẩm và chỉ số mở rộng
    var namePattern = /Products\[(\d+)\]\.Extends\[(\d+)\]\.Type/;
    var match = namePattern.exec(this.name); // Lấy thông tin từ thuộc tính name của select

    if (match) {
        var productIndex = match[1]; // Chỉ số của sản phẩm
        var extendProductIndex = match[2]; // Chỉ số của mở rộng sản phẩm

        // Tìm input field dựa trên tên name tương ứng
        var $inputField = $(`#${tableId} input[name='InvVATExtend.Products[${productIndex}].Extends[${extendProductIndex}].Value']`);

        // Xử lý thay đổi loại dữ liệu của input field tương ứng dựa trên giá trị đã chọn
        switch (selectedType) {
            case '1':
                $inputField.attr('type', 'text');
                break;
            case '2':
                $inputField.attr('type', 'number');
                break;
            case '3':
                $inputField.attr('type', 'date');
                break;
            case '4':
                $inputField.attr('type', 'datetime-local');
                break;
            case '5':
                $inputField.attr('type', 'checkbox'); // Đây là một sự thay đổi để phù hợp với loại giá trị boolean
                break;
            default:
                $inputField.attr('type', 'text');
        }
    }
});
//=====================================================Xử lý kiểu của value bảng extend khi chọn type-END===============
////====================================


//=================================================

//========================Lấy ID hoá đơn từ url để cập nhật=========================

$('#invVATID').val((new URLSearchParams(window.location.search)).get('ID'));

//========================================Hiển thị kiểu date nhưng khi submit thì gửi kiểu date-time
$('input[type="datetime-local"].date-only').each(function () {
    var $input = $(this);
    var value = $input.val();

    if (value) {
        var datePart = value.split('T')[0];
        $input.val(datePart + 'T00:00');
    }
});

//==========================================Xử lý lưu list email==================
$('#CreateInvVATForm, #UpdateInvVATForm').on('submit', function (event) {
    if (!this.hasAttribute('data-processed')) {
        event.preventDefault();

        var emailString = $('#cusEmailsOther').val();
        var emailArray = emailString.split(',').map(function (email) {
            return $.trim(email);
        });
        var processedEmails = emailArray.join(',');
        $('#cusEmailsOther').val(processedEmails);

        this.setAttribute('data-processed', 'true');
    }
});

//============================Thêm autocomplete theo mã số thuế===========================
let companyCustomers = [];
$('.CusCode').on('input', function () {
    CallAjax('GET', '/CompanyCustomer/SearchCustomerByCode', {
        SearchText: $(this).val(),
    }, function (response) {
        companyCustomers = response.data.items;
    })
    $(this).attr("autocomplete", "on");

    $(this).autocomplete({
        source: companyCustomers.map(c => c.code),
        select: function (event, ui) {
            const customer = companyCustomers.find(c => c.code === ui.item.value);
            if (customer) {
                $("input[name='CusTaxCode']").val(customer.taxCode);
                $("input[name='BuyerName']").val(customer.customerName);
                $("input[name='CusName']").val(customer.companyName);
                $("input[name='CusCode']").val(customer.CusCode);
                $("input[name='CusEmail']").val(customer.email);
                $("input[name='InvVATExtend.CusPhone']").val(customer.phone);
                $("input[name='InvVATExtend.CusEmailsOther']").val(customer.emailOther);
                $("input[name='InvVATExtend.CusBankAccountNumber']").val(customer.bankAccountNumber);
                $("input[name='InvVATExtend.CusBankName']").val(customer.bankName);
                $("input[name='InvVATExtend.CusAddress']").val(customer.companyAddress);
            }
        }
    })
});


///=====================================================

$('.productCharacteristic').each(function () {
    var $row = $(this).closest("tr");
    var productCharacteristic = $(this).val();

    switch (productCharacteristic) {
        case "1":
            $row.find('input, select, button').prop("disabled", false);
            $row.find('.productUnit').attr('require', "required");
            $row.find('.productTaxRate').attr('require', "required");
            $row.find('.productTaxRate').on('invalid', function () {
                ShowToastError("Sai định dạng dữ liệu", "Vui lòng chọn mức thuế suất");
            })
            break;
        case "2": 
            $row.find('input, select, button').prop("disabled", false);
            $row.find('.productUnit').attr('require', "required");
            $row.find('.productTaxRate').removeAttr("required");
            break;
        case "3":
            $row.find('.productUnit').removeAttr('required');
            $row.find('input, select, button').prop("disabled", false);
            $row.find('.productTaxRate').removeAttr("required");
            break;
        case "4": 
            $row.find('input:not(.productName)').val('');
            $row.find('input:not(.productName), select:not(.productCharacteristic )').prop("disabled", true);
            $row.find('.productTaxRate').removeAttr("required");
            break;
        default:
            break;
    }
});

$(".cusTaxCode").addEvent('change paste', function () {
    var cusTaxCode = $(".cusTaxCode").val();
    if (cusTaxCode) {
        $(".cusName").attr("required", "true");
        $(".cusName").on('invalid', function () {
            ShowToastError("Lỗi", "Vui lòng nhập tên công ty");
        })
        $(".cusAddress").attr("required", "true");
        $(".cusAddress").on('invalid', function () {
            ShowToastError("Lỗi", "Vui lòng nhập địa chỉ công ty");
        })
    } else {
        $(".cusName").removeAttr("required");
        $(".cusAddress").removeAttr("required");
    }
})