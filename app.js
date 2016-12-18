angular.module("mainApp", [
  'ui.router',
])

angular.module("mainApp").directive('onReadFile', function ($parse) {
    return {
        restrict: 'A',
        scope: false,
        link: function(scope, element, attrs) {
            element.bind('change', function(e) {

                var onFileReadFn = $parse(attrs.onReadFile);
                var reader = new FileReader();

                reader.onload = function() {
                    var fileContents = reader.result;

                    scope.$apply(function() {
                        onFileReadFn(scope, {
                            'contents' : fileContents
                        });
                    });
                };
                reader.readAsText(element[0].files[0]);
            });
        }
    };
})


angular.module("mainApp").controller('homeCtrl', function($scope){
    $scope.sortIndexes = function(items, contents) {
      items = _.sortBy(items, function(index) {
        return index.index
      })
      items = _.map(items, function(item, index) {
        var start = item.index
        if (items[index+1]) {
          var end = items[index + 1].index
        }
        else {
          end = contents.length-1
        }
        return {content:contents.slice(start, end), type:item.type}
      })
      items = _.filter(items, function(item) {
        return item.content !== ""
      })
      $scope.contactItems = _.filter(items, function(item) {
        return item.type === "name" || item.type === "email" || item .type === "phone" || item.type === "objective"
      })
      $scope.infoItems = _.filter(items, function(item) {
        return item.type !== "name" && item.type !== "email" && item .type !== "phone" && item.type !== "objective"
      })
      $scope.hideButton = true
    }



    $scope.displayFileContents = function(contents) {
        var indexes = []
        $scope.results = contents;
        var nameIndex = {index:contents.search(/name/i), type:"name"};
        var phoneIndex = {index:contents.search(/phone/i), type:"phone"}
        var emailIndex = {index:contents.search(/email/i), type:"email"}
        var phone = contents.match(/\(?\d+\)?[-.\s]?\d+[-.\s]?\d+/);
        var email = contents.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
        var objectiveIndex = {index:contents.search(/objective/i), type:"objective"}
        var skillsIndex = {index:contents.search(/key skill|skills/i), type:"skills"}
        var experienceIndex ={index: contents.search(/employment history|experience|work experience/i), type:"experience"}
        var educationIndex = {index:contents.search(/education/i), type:"education"}
        var endIndex = {index:contents.length-1}
        $scope.name = name
        $scope.phone = phone[0]
        $scope.email = email[0]

        indexes.push(nameIndex, phoneIndex, emailIndex, objectiveIndex, skillsIndex, experienceIndex, educationIndex, endIndex)
        $scope.sortIndexes(indexes, contents)
    };

});
