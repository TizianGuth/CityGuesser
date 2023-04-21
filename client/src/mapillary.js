const again = 50;

const access_token = "MLY|6166005043478579|dedb03fb4450e41adc205d3494d475d9";
const image_limit = 4;
const image_minimum = 4;
const margin = 0.0045 * 0.05; // roughly 0.05km

let min_lat = 49.878577;
let min_lon = 10.847871;
let max_lat = 49.917206;
let max_lon = 10.945574;

let last_rnd_x = 0;
let last_rnd_y = 0;

var urls = [];

const GetImageUrl = async function () {
    await start(); 
    const i = randomRangeInt(0, image_limit - 1);
    var u = urls[i];
    if (u == undefined) {
        console.log(urls);
        console.log(i);
    }
    return u;
    
    


}

async function start() {
    let bool;
    for (let i = 0; i < again; i++) {
        bool = await retrieve();
        if (bool) {
            break;
        }
        urls = [];
    }
}


async function retrieve() {
    let validImgCount = 0;
    const IDs = await getImageIDs();

    if (IDs == null || IDs.length < image_minimum)
        return false;

    for (let i = 0; i < image_limit; i++) {
        const img = IDs[i]["id"]
        var imgInfo = await GetImageUrlById(img);
        urls.push(imgInfo[0]);
        validImgCount++;
    }

    return validImgCount >= image_minimum;
}

async function getImageIDs() {
    var coords = getRandomBounds(min_lat, min_lon, max_lat, max_lon, margin);

    const api_url = "https://graph.mapillary.com/images?access_token=" + access_token + "&fields=id&bbox=" + coords[0] + "," + coords[1] + "," +
    coords[2]+ "," +  coords[3] + "& limit=" + image_limit;
    const response = await fetch(api_url,
        {
            headers: { "Authorization": "OAuth " + access_token }
        }
    );
    const myJson = await response.json();

    const IDs = myJson["data"];

    return IDs;
}

async function GetImageUrlById(id) {
    const api_url = 'https://graph.mapillary.com/' + id + "?access_token=" + access_token + "&fields=thumb_2048_url,width";
    const response = await fetch(api_url,
        {
            headers: { 'Authorization': 'OAuth ' + access_token }
        }
    );
    const myJson = await response.json();
    let image_url = myJson["thumb_2048_url"];
    let image_width = myJson["width"];
    
    return [image_url, image_width];

}

function getRandomBounds(minLat, minLon, maxLat, maxLon, margin) {
    let randX = randomRangeFloat(minLat, maxLat);
    let randY = randomRangeFloat(minLon, maxLon);
    while (Math.abs(randX - last_rnd_x) < margin * 3) {
        randX = randomRangeFloat(minLat, maxLat);
    }
    while (Math.abs(randY - last_rnd_y) < margin * 3) {
        randY = randomRangeFloat(minLon, maxLon);
    }

    last_rnd_x = randX;
    last_rnd_y = randY;


    return [randY - margin, randX - margin, randY + margin, randX + margin];
}

function randomRangeFloat(min, max) {
    let cal = (Math.random() * (max - min) + min);
    return parseFloat(cal);
}

function randomRangeInt(min, max) {
    return Math.round(randomRangeFloat(min, max));
}
   
module.exports = {
    GetImageUrl
}
