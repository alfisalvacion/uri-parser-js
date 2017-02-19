var form = document.getElementById('url-form');
form.addEventListener('submit', function(e) {
    e.preventDefault();
    var uri = document.getElementById('uri-box').value;
    var uriParts = parseUri(uri);
    render(uriParts);
});

function render(uriParts) {
    document.getElementById('parts').className = '';
    for (var key in uriParts) {
        document.getElementById(key + '-value').innerHTML = uriParts[key];
    }
}

function parseUri(uri) {
    var uriParts = {
        scheme: '',
        authority: '',
        path: '',
        query: '',
        fragment: ''
    };

    var legitSchemes = ['https', 'http', 'file', 'ftp', 'urn', 'mailto' ];
    var tmpStr = '';
    var state = 'scheme';
    var slashes = 0;
    
    for (var i = 0; i < uri.length; i++) {
        if (state == 'scheme') {
            if (uri[i] == ':') {
                uriParts.scheme = tmpStr;
                tmpStr = '';
                state = 'authority';
                if (uriParts.scheme == 'mailto') slashes = 2;
                else if (uriParts.scheme == 'urn') state = 'path';
                continue;
            } else if (uri[i] == '/') { // for no scheme
                if (uri[i + 1] != '/') {
                    slashes++;
                    state = 'path';
                    continue;
                }
                slashes++;
                state = 'authority';
                continue;
            }
        } else if (state == 'authority') {
            if (slashes < 2) {
                if (uri[i] == '/') 
                    slashes++;
            } else {
                if (uri[i] == '/' || uri[i] == '?' || uri[i] == '#') {
                    tmpStr = tmpStr.replace('/', '');
                    tmpStr = tmpStr.replace('/', '');
                    uriParts.authority = tmpStr;
                    tmpStr = '';
                    state = 'path'; 
                    slashes = 0;
                    continue;
                } 
            }
        } else if (state == 'path') {
            if (slashes < 1) {
                if (uri[i] == '/') 
                    slashes++;
            } else {
                if (uri[i] == '?' || uri[i] == '#') {
                    tmpStr = tmpStr.replace('/', '');
                    uriParts.path = tmpStr;
                    tmpStr = '';
                    if (uri[i] == '?') state = 'query';
                    else if (uri[i] == '#') state = 'fragment';
                    // state = 'query';
                    slashes = 0;
                    continue;
                }
            }
        } else if (state == 'query') {
            if (uri[i] == '#') {
                tmpStr = tmpStr.replace('?', '');
                uriParts.query = tmpStr;
                tmpStr = '';
                state = 'fragment';
                continue;
            }
        } else if (state == 'fragment') {

        }
        tmpStr += uri[i];
    }

    switch (state) {
        case 'scheme': 
            if (legitSchemes.indexOf(tmpStr) == -1) uriParts.path = tmpStr;
            else { uriParts.scheme = tmpStr; }
            break;
        case 'authority': 
            tmpStr = tmpStr.replace('/', '');
            tmpStr = tmpStr.replace('/', '');
            uriParts.authority = tmpStr; 
            break;
        case 'path': 
            uriParts.path = tmpStr; 
            break;
        case 'query': 
            tmpStr = tmpStr.replace('?', '');
            uriParts.query = tmpStr; 
            break;
        case 'fragment': 
            tmpStr = tmpStr.replace('#', '');
            uriParts.fragment = tmpStr; 
            break;
    }
    
    return uriParts;
}