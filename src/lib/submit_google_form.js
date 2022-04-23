function submitGoogleForm(form_summary) {
    let form_action = "https://docs.google.com/forms/d/1wdiZObfkHM33v4a7cA2DWZRtKhWNfrh3rwPOWXYDlTU";
    //let form_action = "https://docs.google.com/forms/d/FAIpQLSeqF9ul6PUYIYNidtXCxdqwT4C0ck8z_prGkhqGzFXJYXGg9A";
    try {
        // Copied pre-fill
        //https://docs.google.com/forms/d/e/1FAIpQLSeqF9ul6PUYIYNidtXCxdqwT4C0ck8z_prGkhqGzFXJYXGg9A/viewform?usp=pp_url&entry.1857901265=name&entry.1590668805=Email+Address&entry.117508226=sachinthya.wagaarachchi@gmail.com&entry.474571559=Law+and+Order+%E0%B6%B1%E0%B7%93%E0%B6%AD%E0%B7%92%E0%B6%BA+%E0%B7%84%E0%B7%8F+%E0%B7%83%E0%B7%8F%E0%B6%B8%E0%B6%BA++%E0%AE%9A%E0%AE%9F%E0%AF%8D%E0%AE%9F%E0%AE%AE%E0%AF%8D++%E0%AE%AE%E0%AE%B1%E0%AF%8D%E0%AE%B1%E0%AF%81%E0%AE%AE%E0%AF%8D+%E0%AE%92%E0%AE%B4%E0%AF%81%E0%AE%99%E0%AF%8D%E0%AE%95%E0%AF%81&entry.239756388=sugg
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
