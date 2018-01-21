var app = angular.module("myApp", []);

app.controller("myCtrl", function($scope, $http) {
    $scope.loading = false;
    $scope.categories = {};
    $scope.currentCategory = {
        title: "Star Wars",
        data: []
    };
    $scope.gif = "";

    $http.get("https://swapi.co/api/")
    .then(function(response) {
        for (var key in response.data){
            var newKey = beautifyName(key);
            response.data[newKey] = response.data[key];
            delete response.data[key];
        }
        $scope.categories = response.data;
        $scope.getAGif();
    });

    $scope.getAGif = function(){
        //We should not display api_key. 
        $http.get("http://api.giphy.com/v1/gifs/trending?api_key=POoidj8LzGIUUEpGgpYUM73Zot3D3BCK")
        .then(function(response){
            var max = response.data.data.length;
            $scope.gif = response.data.data[Math.floor(Math.random() * max)].images.original.url;
        });
    }

    $scope.switchCategory = function(categoryKey){
        $scope.loading = true;
        $scope.currentCategory.title = categoryKey;
        $scope.currentCategory.data = [];
        $http.get($scope.categories[categoryKey])
        .then(function(response) {
            response.data.results = cleanData(response.data.results);
            response.data.results = beautifyArray(response.data.results);
            $scope.currentCategory.data = response.data.results;
            $scope.loading = false;
        });
        nav_close();
    }
});

function cleanData(rawData){
    var newData = rawData;
    for (var i in newData){
        for (var key in newData[i]){
            if (typeof(newData[i][key]) == "object"){
                delete newData[i][key];
            } else if(typeof(newData[i][key]) == "number"){
            } else if(typeof(newData[i][key]) == "string"
                        && newData[i][key].indexOf("https://")!=-1){
                delete newData[i][key];
            } else if (/\d+\-\d+\-\d+T.+Z/.test(newData[i][key])){
                delete newData[i][key];
            }
        }
    }
    return newData;
}

function beautifyName(nameString){
    var newName = nameString.replace('_', ' ');

    var indexSpace = -1;
    newName[indexSpace+1] = newName[indexSpace+1].toUpperCase();
    newName = newName.substr(0, indexSpace+1)
    + newName[indexSpace+1].toUpperCase()
    + newName.substr(indexSpace + 2);

    var indexSpace = newName.indexOf(' ');
    newName[indexSpace+1] = newName[indexSpace+1].toUpperCase();
    newName = newName.substr(0, indexSpace+1)
    + newName[indexSpace+1].toUpperCase()
    + newName.substr(indexSpace + 2);

    return newName;
}

function beautifyArray(dataArray){
    var newData = dataArray;
    for (var i in newData){
        for (var key in newData[i]){
            var newKey = beautifyName(key);
            newData[i][newKey] = newData[i][key];
            delete newData[i][key];
        }
    }
    return newData;
}

function nav_open() {
    document.getElementById("wrapper").style.marginLeft = "15rem";
        document.getElementById("mySidebar").style.display = "block";
}
function nav_close() {
    document.getElementById("wrapper").style.marginLeft = "0%";
    document.getElementById("mySidebar").style.display = "none";
}
