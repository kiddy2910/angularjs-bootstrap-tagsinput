angular.module('angularApp', ['angularjs.bootstrap.tagsinput.template', 'angularjs.bootstrap.tagsinput'])
    .controller('MainController', function($scope) {
        $scope.dummyTags = [
            'tag1', 'tag2', 'tag3', 'tag4', 'tag5'
        ];
        $scope.eventLogs = [];
        $scope.manualTag = 'tag3';
        $scope.tagsProperties = {
            tagsinputId: '$$$',
            maxTags: 10,
            maxLength: 15,
            placeholder: 'Please input the phone number'
        };

        $scope.corrector = function(tag) {
            return 'fix_' + tag;
        };
        $scope.matcher = function(tag) {
            return true;
        };

        $scope.onTagsChange = function(data) {
            $scope.eventLogs.push('Tag changed-----[totalTags=' + data.totalTags + ' | tag=' + data.tag +
                ' | tags=' + angular.toJson(data.tags) + ']');
        };

        $scope.onTagsAdded = function(data) {
            $scope.eventLogs.push('Tag added--------[totalTags=' + data.totalTags + ' | tag=' + data.tag +
                ' | tags=' + angular.toJson(data.tags) + ']');
        };

        $scope.onTagsRemoved = function(data) {
            $scope.eventLogs.push('Tag removed-----[totalTags=' + data.totalTags + ' | tag=' + data.tag +
                ' | tags=' + angular.toJson(data.tags) + ']');
        };

        $scope.addTag = function() {
            $scope.$broadcast('tagsinput:add', $scope.manualTag, $scope.tagsProperties.tagsinputId);
        };

        $scope.removeTag = function() {
            $scope.$broadcast('tagsinput:remove', $scope.manualTag, $scope.tagsProperties.tagsinputId);
        };

        $scope.clearTags = function() {
            $scope.$broadcast('tagsinput:clear', $scope.tagsProperties.tagsinputId);
        };
    });