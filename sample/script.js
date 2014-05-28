angular.module('angularApp', ['angularjs.bootstrap.tagsinput.template', 'angularjs.bootstrap.tagsinput'])
    .controller('MainController', function($scope) {
        $scope.eventLogs = [];
        $scope.tagsProperties = {
            tagsinputId: '$$$',
            initTags: ['+84111111111', '+84222222222', '+84333333333', '+84444444444', '+84555555555'],
            maxTags: 10,
            maxLength: 15,
            placeholder: 'Please input the phone number',
            manualTag: '+84333333333'
        };

        $scope.correctPhoneNumber = function(number) {
            return correctPhoneNumber(number);
        };
        $scope.validatePhoneNumber = function(number) {
            return isValidPhoneNumber(number);
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
            $scope.$broadcast('tagsinput:add', $scope.tagsProperties.manualTag, $scope.tagsProperties.tagsinputId);
        };

        $scope.removeTag = function() {
            $scope.$broadcast('tagsinput:remove', $scope.tagsProperties.manualTag, $scope.tagsProperties.tagsinputId);
        };

        $scope.clearTags = function() {
            $scope.$broadcast('tagsinput:clear', $scope.tagsProperties.tagsinputId);
        };

        function correctPhoneNumber(number) {
            var SINGAPORE_COUNTRY_CODE = '+65';
            var PLUS = '+';
            var correctedNumber;

            if(number == null) {
                return '';
            }

            correctedNumber = stripAllowedChars(number);
            if(isSingaporePhoneNumberWithoutCountryCode(correctedNumber)) {
                return SINGAPORE_COUNTRY_CODE + correctedNumber;
            } else {
                return PLUS + correctedNumber;
            }
        }

        function isValidPhoneNumber(number) {
            var ONLY_DIGITS = /^\d{5,15}$/;  // in range of [5, 15] characters

            if(number == null) {
                return false;
            }

            var correctedNumber = stripAllowedChars(number);
            return ONLY_DIGITS.test(correctedNumber);
        }

        function isSingaporePhoneNumber(number) {
            var pattern = /^\+65[3689]\d{7}$/;
            return number != null && pattern.test(number);
        }

        function isSingaporePhoneNumberWithoutCountryCode(number) {
            var SINGAPORE_CODE = '+65';
            return isSingaporePhoneNumber(SINGAPORE_CODE + number);
        }

        function stripAllowedChars(number) {
            var ALLOWED_CHARS = /[-\(\), +]/g;    // -(), +
            return number.replace(ALLOWED_CHARS, '');
        }
    });