const apiKey = "b51a816f55c2b752fe029e625cd2d81b";
const endpoint = "https://gateway.marvel.com";

const characterMap = {};
const seriesMap = {};


function searchCharacters(searchStr, offset, limit) {
    offset = offset || 0;
    limit = limit || 20;
    const url = new URL(`${endpoint}/v1/public/characters`);
    const params = {
        nameStartsWith: searchStr,
        orderBy: "name,modified",
        offset: offset,
        limit: limit,
        apikey: apiKey
    };
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    return fetch(url.toString())
        .then(response => response.json())
}


function searchSeries(searchStr, offset, limit) {
    const url = new URL(`${endpoint}/v1/public/series`);
    const params = {
        titleStartsWith: searchStr,
        orderBy: "title,startYear",
        offset: offset,
        limit: limit,
        apikey: apiKey
    };
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    return fetch(url)
        .then(response => response.json())
}

function fetchCharacter(id) {

    if (characterMap[id]) {
        // console.log(`Returning cached character ${id}`);
        return Promise.resolve(characterMap[id])
    }

    const url = new URL(`${endpoint}/v1/public/characters/${id}`);
    const params = {
        apikey: apiKey
    };
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    return fetch(url.toString())
        .then(response => response.json())
        .then(json => {
            characterMap[id] = json.data.results[0];
            return characterMap[id];
        })
}

function fetchSeries(id) {

    if (seriesMap[id]) {
        // console.log(`Returning cached character ${id}`);
        return Promise.resolve(seriesMap[id])
    }

    const url = new URL(`${endpoint}/v1/public/series/${id}`);
    const params = {
        apikey: apiKey
    };
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    return fetch(url.toString())
        .then(response => response.json())
        .then(json => {
            seriesMap[id] = json.data.results[0];
            return seriesMap[id];
        })
}

function fetchComicsForSeries(id, offset, limit) {
    const url = new URL(`${endpoint}/v1/public/series/${id}/comics`);
    const params = {
        apikey: apiKey,
        offset: offset,
        limit: limit,
        orderBy: "issueNumber"
    };

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    return fetch(url.toString())
        .then(response => response.json())
        .then(json => {

            return json
        })
}

function fetchComicsForCharacter(characterId, offset, limit) {
    const url = new URL(`${endpoint}/v1/public/characters/${characterId}/comics`);
    const params = {
        apikey: apiKey,
        offset: offset,
        limit: limit,
        orderBy: "onsaleDate"
    };

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    return fetch(url.toString())
        .then(response => response.json())
        .then(json => {
            return json.data // just the envelope with offset, limit, total, count and results.
        })
}

const api = {
    searchCharacters,
    searchSeries,
    fetchCharacter,
    fetchSeries,
    fetchComicsForSeries,

    fetchComicsForCharacter,
};


export default api;



