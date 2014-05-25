angular.module('angularApp', ['angularjs.bootstrap.tagsinput.template',
    'angularjs.bootstrap.tagsinput'])

    .controller('MainController', function($scope) {
        $scope.dummyTags = [
            'tag1', 'tags2', 'tag3', 'tag4', 'tag5'
        ];

        $scope.corrector = function(tag) {
            return 'f' + tag;
        };
        $scope.matcher = function(tag) {
            return tag;
        };
    });