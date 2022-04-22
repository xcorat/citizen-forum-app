function submitGoogleForm(form_summary) {
    let form_action = "https://docs.google.com/forms/d/1wdiZObfkHM33v4a7cA2DWZRtKhWNfrh3rwPOWXYDlTU";
    try {
        // var data = [].slice.call(form).map(function(control) {
        //     return 'value' in control && control.name ?
        //     control.name + '=' + (control.value === undefined ? '' : control.value) :
        //     '';
        // }).join('&');
        var xhr = new XMLHttpRequest();

        let full_post = "# " + form_summary.title + " #\n" + form_summary.post

        let data =    "entry.1857901265=" + encodeURIComponent(form_summary.name)
                    + "&entry.1590668805=" + encodeURIComponent(form_summary.digIDProvider)
                    + "&entry.117508226=" + encodeURIComponent(form_summary.digID)
                    + "&entry.474571559=" + encodeURIComponent(form_summary.topic)
                    + "&entry.239756388=" + encodeURIComponent(full_post);

       console.log(data)
        xhr.open('POST', form_action + '/formResponse', true);
        xhr.setRequestHeader('Accept',
            'application/xml, text/xml, */*; q=0.01');
        xhr.setRequestHeader('Content-type',
            'application/x-www-form-urlencoded; charset=UTF-8');
        xhr.send(data);
    } catch(e) {}

    return false;
}

export default submitGoogleForm;
