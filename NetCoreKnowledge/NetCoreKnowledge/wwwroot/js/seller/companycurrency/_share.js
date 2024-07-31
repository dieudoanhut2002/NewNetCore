$(document).ready(function () {
    const currencyData = [
        {
            code: "USD",
            name: "United States Dollar",
            integerPart: "Dollar",
            decimalPart: "Cent",
            totalAmountDecimalPlaces: 2,
            quantityDecimalPlaces: 6,
            taxDetailDecimalPlaces: 2,
            totalTaxAmountDecimalPlaces: 2
        },
        {
            code: "EUR",
            name: "Euro",
            integerPart: "Euro",
            decimalPart: "Cent",
            totalAmountDecimalPlaces: 2,
            quantityDecimalPlaces: 6,
            taxDetailDecimalPlaces: 2,
            totalTaxAmountDecimalPlaces: 2
        },
        {
            code: "VND",
            name: "Việt Nam đồng",
            integerPart: "Đồng",
            decimalPart: null,
            totalAmountDecimalPlaces: 0,
            quantityDecimalPlaces: 6,
            taxDetailDecimalPlaces: 0,
            totalTaxAmountDecimalPlaces: 0
        }
    ];

    $("#Code").autocomplete({
        source: currencyData.map(c => c.code),
        select: function (event, ui) {
            const selectedCurrency = currencyData.find(c => c.code === ui.item.value);
            if (selectedCurrency) {
                $("input[name='Name']").val(selectedCurrency.name);
                $("input[name='IntegerPart']").val(selectedCurrency.integerPart);
                $("input[name='DecimalPart']").val(selectedCurrency.decimalPart);
                $("input[name='TotalAmountDecimalPlaces']").val(selectedCurrency.totalAmountDecimalPlaces);
                $("input[name='QuantityDecimalPlaces']").val(selectedCurrency.quantityDecimalPlaces);
                $("input[name='TaxDetailDecimalPlaces']").val(selectedCurrency.taxDetailDecimalPlaces);
                $("input[name='TotalTaxAmountDecimalPlaces']").val(selectedCurrency.totalTaxAmountDecimalPlaces);
            }
        }
    });
});