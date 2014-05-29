/**
 * angularjs-bootstrap-tagsinput
 * Version: 0.2.0 (2014-05-29)
 *
 * Author: kiddy2910 <dangduy2910@gmail.com>
 * https://github.com/kiddy2910/angularjs-bootstrap-tagsinput.git
 *
 * Copyright (c) 2014 
 */
angular.module('angularjs.bootstrap.tagsinput', []).directive('tagsinput', [
  '$templateCache',
  '$timeout',
  'TagsinputConstants',
  function ($templateCache, $timeout, TagsinputConstants) {
    var tagMap = [], removePreviousTag = false;
    // Properties of scope
    var maxTags, maxLength, placeholder, delimiter, readOnly, fnCorrector, fnMatcher, onTagsChangedCallback, onTagsAddedCallback, onTagsRemovedCallback;
    // Variables of DOM
    var $container, $tagListContainer, $tagTemplate, $taginput, $taginputMessage;
    var tagsinput = {
        scope: {
          initTags: '=?',
          tagsinputId: '=?',
          maxTags: '=?maxtags',
          maxLength: '=?maxlength',
          placeholder: '=?',
          delimiter: '@',
          readonly: '@',
          corrector: '&',
          matcher: '&',
          onTagsChanged: '&onchanged',
          onTagsAdded: '&onadded',
          onTagsRemoved: '&onremoved'
        },
        replace: true,
        template: function (element, attrs) {
          var templateUrl = attrs.template == null ? TagsinputConstants.DEFAULT_TEMPLATE : attrs.template;
          return $templateCache.get(templateUrl);
        },
        link: function (scope, element) {
          var id = scope.tagsinputId == null ? '' : scope.tagsinputId;
          initConfigs(scope, element);
          loadInitTags(scope.initTags);
          bindDomEvents();
          scope.$on('tagsinput:add', function (event, tag, tagsinputId) {
            if (tagsinputId == null || tagsinputId === id) {
              if (tag.length === 0) {
                return;
              }
              var correctedTagKey = correctTag(tag);
              if (!isValidTag(correctedTagKey)) {
                return;
              }
              addValidTag(correctedTagKey);
            }
          });
          scope.$on('tagsinput:remove', function (event, tag, tagsinputId) {
            if (tagsinputId == null || tagsinputId === id) {
              removeTag(tag);
            }
          });
          scope.$on('tagsinput:clear', function (event, tagsinputId) {
            if (tagsinputId == null || tagsinputId === id) {
              clearTags();
            }
          });
        }
      };
    function initConfigs(scope, element) {
      maxTags = parseInt(scope.maxTags, 10);
      maxLength = parseInt(scope.maxLength, 10);
      placeholder = scope.placeholder == null ? '' : scope.placeholder;
      delimiter = getDelimiter(scope.delimiter);
      readOnly = getReadOnly(scope.readonly);
      fnCorrector = scope.corrector;
      fnMatcher = scope.matcher;
      onTagsChangedCallback = scope.onTagsChanged;
      onTagsAddedCallback = scope.onTagsAdded;
      onTagsRemovedCallback = scope.onTagsRemoved;
      $container = $(element);
      $tagListContainer = $container.find(TagsinputConstants.Role.TAGS);
      $tagTemplate = $tagListContainer.find(TagsinputConstants.Role.TAG).clone();
      $taginput = $container.find(TagsinputConstants.Role.TAGSINPUT);
      $taginputMessage = $container.find(TagsinputConstants.Role.TAGSINPUT_MESSAGE);
      $taginput.attr('placeholder', placeholder);
      $tagListContainer.html('');
      if (readOnly === true) {
        $taginput.remove();
      }
      if (isNaN(maxTags)) {
        maxTags = -1;
      }
      if (!isNaN(maxLength)) {
        $taginput.attr('maxlength', maxLength);
      }
    }
    function getDelimiter(d) {
      if (d == null) {
        return TagsinputConstants.DELIMITER;
      }
      if (d === 'false') {
        return '';
      }
      return d;
    }
    function getReadOnly(ro) {
      if (ro == null) {
        return false;
      }
      return ro === 'true';
    }
    function loadInitTags(tags) {
      if (tags != null) {
        for (var i = 0; i < tags.length; i++) {
          if (!isValidTag(tags[i])) {
            continue;
          }
          addValidTag(tags[i]);
        }
      }
    }
    function bindDomEvents() {
      $container.on('click', function () {
        $taginput.focus();
      });
      $taginput.on('blur', function () {
        var e = $.Event('keydown');
        e.which = 13;
        $taginput.trigger(e);
      });
      $taginput.on('keydown', function (event) {
        var tagVal = $taginput.val();
        tagsinputIsValid();
        if (tagVal.length > 0) {
          removePreviousTag = false;
        }
        switch (event.which) {
        case 8:
          // BACKSPACE
          if (tagVal.length === 0) {
            if (removePreviousTag === true) {
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
            if (tagVal.length === 0) {
              return;
            }
            var inputtedTags = splitTags(tagVal);
            for (var i = 0; i < inputtedTags.length; i++) {
              var correctedTagKey = correctTag(inputtedTags[i]);
              if (!isValidTag(correctedTagKey)) {
                tagsinputIsInvalid();
                return;
              }
              addValidTag(correctedTagKey);
            }
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
      for (var i = 0; i < tagMap.length; i++) {
        if (tagMap[i].key === tagKey) {
          return tagMap[i];
        }
      }
      return null;
    }
    function correctTag(tagKey) {
      if (tagKey.length === 0) {
        return tagKey;
      }
      var correctedTagKey = fnCorrector({ tag: tagKey });
      if (correctedTagKey == null) {
        correctedTagKey = tagKey;
      }
      return correctedTagKey;
    }
    function isValidTag(tagKey) {
      if (tagKey.length === 0) {
        return false;
      }
      var valid = fnMatcher({ tag: tagKey });
      if (valid == null) {
        valid = true;
      }
      return valid;
    }
    function addValidTag(tagKey) {
      if (isMaxTagsExceeded()) {
        return;
      }
      var existingTagData = getTagData(tagKey);
      if (existingTagData == null) {
        var $tag = $($tagTemplate[0]).clone();
        $tag.find(TagsinputConstants.Role.TAG_VALUE).html(tagKey);
        $tag.find(TagsinputConstants.Role.TAG_REMOVE).data('item', tagKey);
        $tag.on('click', TagsinputConstants.Role.TAG_REMOVE, function () {
          removeTag($(this).data('item'));
        });
        $tagListContainer.append($tag);
        var tagData = createTagData(tagKey, $tag);
        tagMap.push(tagData);
        validateMaxTags();
        invokeFnInAngularContext(function () {
          onTagsAddedCallback({ data: createTagDataCallback(tagKey) });
          onTagsChangedCallback({ data: createTagDataCallback(tagKey) });
        });
      } else {
        flashDuplicatedTag(tagKey);
      }
    }
    function removeTag(tagKey) {
      var removedTagData = getTagData(tagKey);
      if (removedTagData != null) {
        removedTagData.dom.remove();
        removeTagOnce(tagMap, function (t) {
          return t.key === tagKey;
        });
        validateMaxTags();
        invokeFnInAngularContext(function () {
          onTagsRemovedCallback({ data: createTagDataCallback(tagKey) });
          onTagsChangedCallback({ data: createTagDataCallback(tagKey) });
        });
      }
    }
    function clearTags() {
      for (var i = 0; i < tagMap.length; i++) {
        tagMap[i].dom.remove();
      }
      tagMap.splice(0, tagMap.length);
      validateMaxTags();
    }
    function removeTagOnce(arr, fn) {
      var index = -1;
      for (var i = 0; i < arr.length; i++) {
        if (fn(arr[i])) {
          index = i;
          break;
        }
      }
      if (index > -1) {
        arr.splice(index, 1);
      }
    }
    function splitTags(tagString) {
      var splittedTags, fixedTags = [];
      if (tagString == null) {
        return [];
      }
      if (delimiter !== '') {
        splittedTags = tagString.split(delimiter);
      } else {
        splittedTags = [tagString];
      }
      for (var i = 0; i < splittedTags.length; i++) {
        fixedTags.push(trim(splittedTags[i]));
      }
      return fixedTags;
    }
    function trim(str) {
      return str == null ? '' : str.replace(/^\s+|\s+$/g, '');
    }
    function createTagDataCallback(changedTag) {
      return {
        totalTags: tagMap.length,
        tags: getTagsList(),
        tag: changedTag
      };
    }
    function getTagsList() {
      var tags = [];
      for (var i = 0; i < tagMap.length; i++) {
        tags.push(tagMap[i].key);
      }
      return tags;
    }
    function flashDuplicatedTag(tagKey) {
      var duplicatedTagData = getTagData(tagKey);
      if (duplicatedTagData != null) {
        duplicatedTagData.dom.fadeOut(100).fadeIn(100);
      }
    }
    function flashTagsinputMessage() {
      $taginputMessage.fadeIn(100).delay(500).fadeOut(800);
    }
    function isMaxTagsExceeded() {
      return maxTags > 0 && tagMap.length >= maxTags;
    }
    function validateMaxTags() {
      var isMaxTags = isMaxTagsExceeded();
      $taginput.attr('readonly', isMaxTags);
      if (isMaxTags === true) {
        $tagListContainer.addClass(TagsinputConstants.ClassCss.TAGSINPUT_MAX_TAGS);
      } else {
        $tagListContainer.removeClass(TagsinputConstants.ClassCss.TAGSINPUT_MAX_TAGS);
      }
    }
    function tagsinputIsValid() {
      $taginput.removeClass(TagsinputConstants.ClassCss.INVALID_INPUT);
    }
    function tagsinputIsInvalid() {
      $taginput.addClass(TagsinputConstants.ClassCss.INVALID_INPUT);
    }
    function invokeFnInAngularContext(fn) {
      $timeout(fn);
    }
    return tagsinput;
  }
]).constant('TagsinputConstants', {
  DEFAULT_TEMPLATE: 'angularjs/bootstrap/tagsinput/tagsinput.tpl.html',
  CONFIRM_KEYS: [
    13,
    9
  ],
  DELIMITER: ',',
  Role: {
    TAGS: '[data-role=tags]',
    TAG: '[data-role=tag]',
    TAG_VALUE: '[data-role=value]',
    TAG_REMOVE: '[data-role=remove]',
    TAGSINPUT: '[data-role=tagsinput]',
    TAGSINPUT_MESSAGE: '[data-role=tagsinput-message]'
  },
  ClassCss: {
    TAGSINPUT_MAX_TAGS: 'tagsinput-maxtags',
    INVALID_INPUT: 'tagsinput-invalid'
  }
});
angular.module('angularjs.bootstrap.tagsinput.template', ['angularjs/bootstrap/tagsinput/tagsinput.tpl.html']);
angular.module('angularjs/bootstrap/tagsinput/tagsinput.tpl.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('angularjs/bootstrap/tagsinput/tagsinput.tpl.html', '<div class="angularjs-bootstrap-tagsinput">\n' + '    <div data-role="tags">\n' + '        <span data-role="tag" class="label label-info">\n' + '            <span data-role="value"></span>\n' + '            <span data-role="remove"></span>\n' + '        </span>\n' + '    </div>\n' + '\n' + '    <div data-role="tagsinput-message">Press BACKSPACE again to delete the last tag.</div>\n' + '\n' + '    <div class="tagsinput">\n' + '        <input data-role="tagsinput" class="form-control" type="text">\n' + '    </div>\n' + '</div>');
  }
]);