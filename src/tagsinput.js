angular.module('angularjs.bootstrap.tagsinput', [])
    .directive('tagsinput', function($templateCache, TagsinputConstants) {
        var tagMap = [], removePreviousTag = false;
        // Properties of scope
        var maxTags, maxLength, placeholder, fnCorrector, fnMatcher;
        // Variables of DOM
        var $container, $tagListContainer, $tagTemplate, $taginput, $taginputMessage;

        var tagsinput = {
            scope: {
                tags: '=?',
                maxTags: '@maxtags',
                maxLength: '@maxlength',
                placeholder: '@',
                corrector: '&',
                matcher: '&'
            },
            replace: true,
            template: function(element, attrs) {
                var templateUrl = attrs.template == null ?
                    TagsinputConstants.DEFAULT_TEMPLATE : attrs.template;
                return $templateCache.get(templateUrl);
            },
            link: function(scope, element) {
                initConfigs(scope, element);
                loadInitTags(scope.tags);
                bindDomEvents();
            }
        };

        function initConfigs(scope, element) {
            maxTags = parseInt(scope.maxTags, 10);
            maxLength = parseInt(scope.maxLength, 10);
            placeholder = scope.placeholder == null ? '' : scope.placeholder;
            fnCorrector = scope.corrector;
            fnMatcher = scope.matcher;
            $container = $(element);
            $tagListContainer = $container.find(TagsinputConstants.Role.TAGS);
            $tagTemplate = $container.find(TagsinputConstants.Role.TAG);
            $taginput = $container.find(TagsinputConstants.Role.TAGSINPUT);
            $taginputMessage = $container.find(TagsinputConstants.Role.TAGSINPUT_MESSAGE);
            $taginput.attr('placeholder', placeholder);
            $tagListContainer.html('');

            if(isNaN(maxTags)) {
                maxTags = -1;
            }
            if(!isNaN(maxLength)) {
                $taginput.attr('maxlength', maxLength);
            }
        }

        function loadInitTags(tags) {
            if(tags != null) {
                _.each(tags, function(t) {
                    addTag(t);
                });
            }
        }

        function bindDomEvents() {
            $container.on('click', function() {
                $taginput.focus();
            });

            $taginput.on('blur', function() {
                var e = $.Event("keydown");
                e.which = 13;
                $taginput.trigger(e);
            });

            $taginput.on('keydown', function(event) {
                var tagVal = $taginput.val();
                tagsinputIsValid();
                if(tagVal.length > 0) {
                    removePreviousTag = false;
                }
                switch(event.which) {
                    case 8:
                        // BACKSPACE
                        if(tagVal.length === 0) {
                            if(removePreviousTag === true) {
                                var lastTag = tagMap[tagMap.length - 1];
                                removeTag(lastTag.key);
                            } else {
                                removePreviousTag = true;
                                flashTagsinputMessage();
                            }
                        }
                        break;

                    default:
                        if ($.inArray(event.which, TagsinputConstants.CONFIRM_KEYS) >= 0) {
                            if(tagVal.length === 0) {
                                return;
                            }

                            var correctedTagVal = fnCorrector({tag: tagVal});
                            if(correctedTagVal == null) {
                                correctedTagVal = tagVal;
                            }

                            if(correctedTagVal.length > 0) {
                                var valid = fnMatcher({tag: correctedTagVal});
                                if(valid === false) {
                                    tagsinputIsInvalid();
                                    return;
                                }
                            }

                            addTag(correctedTagVal);
                            $taginput.val('');
                            event.preventDefault();
                        }
                        break;
                }
            });
        }

        function createTagData(tag, $dom) {
            return {
                key: tag,
                dom: $dom
            };
        }

        function getTagData(tagKey) {
            return _.find(tagMap, function(t) {
                return t.key === tagKey;
            });
        }

        function addTag(tagKey) {
            if(tagKey.length === 0) {
                return;
            }
            var existingTagData = getTagData(tagKey);
            if(existingTagData == null) {
                var $tag = $($tagTemplate[0].outerHTML);
                $tag.find(TagsinputConstants.Role.TAG_VALUE).html(tagKey);
                $tag.find(TagsinputConstants.Role.TAG_REMOVE).data('item', tagKey);
                $tag.on('click', TagsinputConstants.Role.TAG_REMOVE, function() {
                    removeTag($(this).data('item'));
                });
                tagMap.push(createTagData(tagKey, $tag));
                $tagListContainer.append($tag);
                validateMaxTags();

            } else {
                flashDuplicatedTag(tagKey);
            }
        }

        function removeTag(tagKey) {
            var removedTagData = getTagData(tagKey);
            if(removedTagData != null) {
                removedTagData.dom.remove();
                removeTagOnce(tagMap, function(t) {
                    return t.key === tagKey;
                });
                validateMaxTags();
            }
        }

        function removeTagOnce(arr, fn) {
            var index = -1;
            for (var i=0; i<arr.length; i++) {
                if(fn(arr[i])) {
                    index = i;
                    break;
                }
            }
            if(index > -1) {
                arr.splice(index, 1);
            }
        }

        function flashDuplicatedTag(tagKey) {
            var duplicatedTagData = getTagData(tagKey);
            if(duplicatedTagData != null) {
                duplicatedTagData.dom.fadeOut(100).fadeIn(100);
            }
        }

        function flashTagsinputMessage() {
            $taginputMessage.fadeIn(100).delay(500).fadeOut(800);
        }

        function validateMaxTags() {
            var readOnly = maxTags > 0 && tagMap.length >= maxTags;
            $taginput.attr('readonly', readOnly);
        }

        function tagsinputIsValid() {
            $taginput.removeClass(TagsinputConstants.ClassCss.INVALID_INPUT);
        }

        function tagsinputIsInvalid() {
            $taginput.addClass(TagsinputConstants.ClassCss.INVALID_INPUT);
        }

        return tagsinput;
    })
    .constant('TagsinputConstants', {
        DEFAULT_TEMPLATE: 'angularjs/bootstrap/tagsinput/tagsinput.tpl.html',
        CONFIRM_KEYS: [13, 9],
        Role: {
            TAGS: '[data-role=tags]',
            TAG: '[data-role=tag]',
            TAG_VALUE: '[data-role=value]',
            TAG_REMOVE: '[data-role=remove]',
            TAGSINPUT: '[data-role=tagsinput]',
            TAGSINPUT_MESSAGE: '[data-role=tagsinput-message]'
        },
        ClassCss: {
            INVALID_INPUT: 'tagsinput-invalid'
        }
    });