$('#formCompanyCusCreate, #formCompanyCusUpdate').on('submit', function (event) {
    if (!this.hasAttribute('data-processed')) {
        event.preventDefault();

        var emailString = $('#emailsOther').val();
        var emailArray = emailString.split(',').map(function (email) {
            return $.trim(email);
        });
        var processedEmails = emailArray.join(',');
        $('#emailsOther').val(processedEmails);

        this.setAttribute('data-processed', 'true');
    }
});

$('#companyCusID').val((new URLSearchParams(window.location.search)).get('ID'));