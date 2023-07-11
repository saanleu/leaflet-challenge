//store URL for the GeoJSON data
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//get request to the url
d3.json(url).then(function(data) {
    createFeatures(data.features);
});

//logging features
function createFeatures(earthquakeData) {
    //display info of mag and location
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}<h3><hr><p>${new Date(feature.properties.time)}</p><hr><p>${feature.properties.mag}</p>`)
    };
    
    //GeoJSON layer with array on earthquakeData object
    function createCircleMarker(feature, latlng) {
        let options = {
            redius: feature.properties.mag*5,
            fillColor: getColor(feature.properties.mag),
            color: "grey",
            weight: 0.7,
            opacity: 1
        }
        return L.circleMarker(latlng, options);
    };

    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: createCircleMarker
    });
    //createMap funciton getting earthquakeData layer
    createMap(earthquakes);
};

//assigns color by depth
function getColor(depth) {
    switch(true) {
        case depth > 90:
            return "#ad393a";
        case depth > 70: 
            return "#d54867"; 
        case depth > 50:
            return "#ffaa08";
        case depth > 30:
            return "#f1d632";
        case depth > 10:
            return "#bed600";
        default:
            return "#1ddb04";
        }
};

//Map creation function
function createMap(earthquakes) {
    //base layer maps
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    let tecmap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
    //baseMaps obj to apply our map base layers
    let baseMaps = {
        "Street Map": streetmap,
        "Topographic Map" : tecmap
    };
    
    //overlay obj to apply overlay layer
    let overlayMap = {
        Earthquakes: earthquakes
    };

    //create and display base layer maps when loading
    let myMap = L.map("map", {
        center: [36.10, -96.70],
        zoom: 5,
        layers: [streetmap, tecmap]
    });
    //control layer for baseMaps and overlayMap
    L.control.layers(baseMaps, overlayMap, {
        collapsed: false
    }).addTo(myMap);
    
    //colors used for depth
    var DColors = ["#ad393a", "#d54867", "#ffaa08", "#f1d632", "#bed600", "#1ddb04"];

    //creates legend and includes colors
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend');
        labels = ["<div style='background-color: lightgray'><strong>&nbsp&nbspDepth (km)&nbsp&nbsp</strong></div>"];
        categories = ['+90', ' 70-90', ' 50-70', ' 30-50', ' 10-30', '-10-10'];
        for (var i=0; i<categories.length; i++) {
            din.innerHTML +=
            labels.push(
                '<li class="circle" style="background-color:' + DColors[i] + '">' + categories[i] + '</li> '
            );
        }
        div.innerHTML = '<ul style="list-style-type:none; text-align: center">' + labels.join('') + '</ul>'
        return div;
    };
    legend.addTo(myMap);
};






