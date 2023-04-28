const again = 50;

const access_token = "MLY|6166005043478579|dedb03fb4450e41adc205d3494d475d9";
const link_limit = 10;
const image_minimum = 2;
const margin = 0.0045 * 0.1;

let min_lat = 49.878577;
let min_lon = 10.847871;
let max_lat = 49.917206;
let max_lon = 10.945574;

let last_rnd_x = 0;
let last_rnd_y = 0;

export let imgs = [];

let generating = false;

let avgTime = [0, 0];


export async function preloadImages(_amount) {
    for (let i = 0; i < _amount; i++) {
        let ids = await getImageIDs();
        if (ids == undefined || ids.length <= image_minimum) {
            ids = await getImageIDs();
            if (ids == undefined || ids.length <= image_minimum) {
                ids = await getImageIDs();
                if (ids == undefined || ids.length <= image_minimum) {
                    ids = await getImageIDs();
                    if (ids == undefined || ids.length <= image_minimum) {
                        ids = await getImageIDs();
                    }
                }
            }
        }
        imgs.push(await getImages(ids, image_minimum));
    }
    console.log("loaded!");
    //  console.log(imgs);
    return imgs;
}

async function getImages(_ids, _amount) {
    let result = [];
    for (let i = 0; i < _amount; i++) {
        // console.log(_ids);
        result.push(await getImageById(_ids[i]["id"]));
    }
    return result;
}

async function getImageById(_id) {
    const api_url = 'https://graph.mapillary.com/' + _id + "?access_token=" + access_token + "&fields=thumb_1024_url,computed_geometry ";
    const response = await fetch(api_url,
        {
            headers: { 'Authorization': 'OAuth ' + access_token }
        }
    );
    const myJson = await response.json();
    let image_url = myJson["thumb_1024_url"];
    let image_info = myJson["computed_geometry"];
    return [image_url, image_info];
}

async function getImageIDs() {
    var randCoords = getRandomBounds(min_lat, min_lon, max_lat, max_lon, margin);

    const api_url = "https://graph.mapillary.com/images?access_token=" + access_token + "&fields=id&bbox=" + randCoords[0] + "," + randCoords[1] + "," +
        randCoords[2] + "," + randCoords[3] + "& limit=" + link_limit;

    const response = await fetch(api_url,
        {
            headers: { "Authorization": "OAuth " + access_token }
        }
    );
    const myJson = await response.json();

    const IDs = myJson["data"];
    return IDs;
}

function getRandomBounds(minLat, minLon, maxLat, maxLon, margin) {
    let randX = randomRangeFloat(minLat, maxLat);
    let randY = randomRangeFloat(minLon, maxLon);
    while (Math.abs(randX - last_rnd_x) < margin * 2) {
        randX = randomRangeFloat(minLat, maxLat);
    }
    while (Math.abs(randY - last_rnd_y) < margin * 2) {
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