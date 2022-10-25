const axios = require('axios');


function getWaybackUrl(url) {  
    return `https://web.archive.org/cdx/search/cdx/`;  
}

function setPayload(url, limit, startYear, stopYear, collapse) {  
    
    return {  
        'url': url,
        'limit': limit,  
        'output': "json",
        'fl': 'timestamp,original',
        'from': startYear,
        'to': stopYear,
        'collapse': collapse
    };  
}


// function test(){
//     getURls('https://www.airbnb.com/', 20, 2000, 2020, 'timestamp:4').then((res) => {  
//         console.log(res);  
//     });  
// }

function convertToPublicUrls(urls) { 
    // console.log("urls", urls);
    let cleanedUrls = urls.map((url) => {  
        return `https://web.archive.org/web/${url[0]}/${url[1]}`;  
    });

    // remove first element of cleanedURls and return
    cleanedUrls.shift();
    return cleanedUrls;
} 

async function getURLs(url, limit, startYear, stopYear, collapse) {  
    ///DOCUMENTATION FOR PARAMS CAN BE FOUND AT 
    /// https://github.com/internetarchive/wayback/tree/master/wayback-cdx-server#basic-usage
    
    
    const payload = setPayload(url, limit, startYear, stopYear, collapse);  
    const waybackUrl = getWaybackUrl(url);  
    let rawUrls = await axios.get(waybackUrl, { params: payload });  
    return convertToPublicUrls(rawUrls.data);
}

exports.getURLs = getURLs;
// test();