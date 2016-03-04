/**
 * angularjs-bootstrap-tagsinput
 * Version: 0.2.1 (2016-03-04)
 *
 * Author: kiddy2910 <dangduy2910@gmail.com>
 * https://github.com/kiddy2910/angularjs-bootstrap-tagsinput.git
 *
 * Copyright (c) 2016 
 */
angular.module('angularjs.bootstrap.tagsinput', []).factory('tagsInput', [
  'TagsInputConstants',
  function (TagsInputConstants) {
    var TagsInput = function (options, element) {
      this.prop = {
        maxTags: parseInt(options.maxTags, 10),
        maxLength: parseInt(options.maxLength, 10),
        placeholder: options.placeholder,
        delimiter: getDelimiter(options.delimiter),
        readOnly: getReadOnly(options.readOnly)
      };
      this.fn = {
        corrector: options.corrector,
        matcher: options.matcher,
        onTagsChanged: options.onTagsChanged,
        onTagsAdded: options.onTagsAdded,
        onTagsRemoved: options.onTagsRemoved,
        onTagsReset: options.onTagsReset
      };
      this.tagMap = new TagMap(this.prop.maxTags);
      this.dom = {};
      this.dom.$container = $(element);
      this.dom.$tagListContainer = $(element).find(TagsInputConstants.Role.TAGS);
      this.dom.$tagTemplate = this.dom.$tagListContainer.find(TagsInputConstants.Role.TAG).clone();
      this.dom.$tagInput = this.dom.$container.find(TagsInputConstants.Role.TAGSINPUT);
      this.dom.$tagInput.attr('placeholder', this.prop.placeholder);
      this.dom.$tagInput.data('placeholder', this.prop.placeholder);
      this.dom.$tagListContainer.find(TagsInputConstants.Role.TAG).remove();
      if (this.prop.readOnly) {
        this.dom.$tagInput.remove();
      }
      if (isNaN(this.prop.maxTags)) {
        this.prop.maxTags = -1;
      }
      if (!isNaN(this.prop.maxLength)) {
        this.dom.$tagInput.attr('maxlength', this.prop.maxLength);
      }
      bindEvents(this);
    };
    TagsInput.prototype.addTag = function (tag) {
      var correctedTag = correctTag(tag, this.fn.corrector);
      if (this.tagMap.isMaxTagsExceeded() || !isValidTag(correctedTag, this.fn.matcher)) {
        return;
      }
      var self = this;
      var tagEntry = this.tagMap.getEntry(correctedTag);
      if (tagEntry == null) {
        var $tag = $(this.dom.$tagTemplate[0]).clone();
        $tag.find(TagsInputConstants.Role.TAG_VALUE).html(correctedTag);
        $tag.find(TagsInputConstants.Role.TAG_REMOVE).data('item', correctedTag);
        $tag.on('click', TagsInputConstants.Role.TAG_REMOVE, function () {
          self.removeTag($(this).data('item'));
        });
        var $tagList = this.dom.$tagListContainer.find(TagsInputConstants.Role.TAG);
        if ($tagList.length > 0) {
          $tag.insertAfter($tagList.last());
        } else {
          this.dom.$tagListContainer.prepend($tag);
        }
        this.tagMap.addEntry(correctedTag, $tag);
        validateMaxTags(this.dom.$tagInput, this.dom.$tagListContainer, this.tagMap);
        var data = getDataCallback(this.tagMap, correctedTag);
        this.fn.onTagsAdded({ data: data });
        this.fn.onTagsChanged({ data: data });
      } else {
        flashDuplicatedTag(this.tagMap, correctedTag);
      }
    };
    TagsInput.prototype.addTags = function (tags) {
      if (!tags) {
        return;
      }
      for (var i = 0; i < tags.length; i++) {
        this.addTag(tags[i]);
      }
    };
    TagsInput.prototype.removeTag = function (tag) {
      if (!this.tagMap.contains(tag)) {
        return;
      }
      this.tagMap.removeEntry(tag);
      validateMaxTags(this.dom.$tagInput, this.dom.$tagListContainer, this.tagMap);
      var data = getDataCallback(this.tagMap, tag);
      this.fn.onTagsRemoved({ data: data });
      this.fn.onTagsChanged({ data: data });
    };
    TagsInput.prototype.removeTags = function (tags) {
      if (!tags) {
        return;
      }
      for (var i = 0; i < tags.length; i++) {
        this.removeTag(tags[i]);
      }
    };
    TagsInput.prototype.clearTags = function () {
      this.tagMap.reset();
      validateMaxTags(this.dom.$tagInput, this.dom.$tagListContainer, this.tagMap);
      this.fn.onTagsReset();
    };
    var TagMap = function (maxTags) {
      this.options = { maxTags: maxTags };
      this._ = {
        entries: [],
        removePreviousTag: false
      };
    };
    TagMap.prototype.addEntry = function (tag, tagDom) {
      this._.entries.push({
        key: tag,
        dom: tagDom
      });
    };
    TagMap.prototype.getEntry = function (tag) {
      var t;
      for (var i = 0; i < this._.entries.length; i++) {
        t = this._.entries[i];
        if (t.key === tag) {
          return t;
        }
      }
      return null;
    };
    TagMap.prototype.getLastEntry = function () {
      return this._.entries[this._.entries.length - 1];
    };
    TagMap.prototype.removeEntry = function (tag) {
      var index = -1;
      for (var i = 0; i < this._.entries.length; i++) {
        if (this._.entries[i].key === tag) {
          this._.entries[i].dom.remove();
          index = i;
          break;
        }
      }
      if (index > -1) {
        this._.entries.splice(index, 1);
      }
    };
    TagMap.prototype.contains = function (tag) {
      var entry = this.getEntry(tag);
      return entry != null;
    };
    TagMap.prototype.isMaxTagsExceeded = function () {
      return this.options.maxTags > 0 && this._.entries.length >= this.options.maxTags;
    };
    TagMap.prototype.getTagList = function () {
      var tags = [];
      for (var i = 0; i < this._.entries.length; i++) {
        tags.push(this._.entries[i].key);
      }
      return tags;
    };
    TagMap.prototype.reset = function () {
      for (var i = 0; i < this._.entries.length; i++) {
        this._.entries[i].dom.remove();
      }
      this._.entries.splice(0, this._.entries.length);
      this._.removePreviousTag = false;
    };
    function bindEvents(tagsInputInstance) {
      var ins = tagsInputInstance;
      ins.dom.$container.unbind();
      ins.dom.$container.on('click', function () {
        ins.dom.$tagInput.focus();
      });
      ins.dom.$tagInput.on('blur', function () {
        var e = $.Event('keydown');
        e.which = 13;
        ins.dom.$tagInput.trigger(e);
      });
      ins.dom.$tagInput.on('keydown', function (event) {
        var tagVal = ins.dom.$tagInput.val();
        setValidCss(ins.dom.$tagInput);
        if (tagVal.length > 0) {
          ins.tagMap._.removePreviousTag = false;
        }
        switch (event.which) {
        case 8:
          // BACKSPACE
          if (tagVal.length === 0) {
            if (ins.tagMap._.removePreviousTag === true) {
              var lastTag = ins.tagMap.getLastEntry();
              if (lastTag) {
                ins.removeTag(lastTag.key);
              }
            } else {
              ins.tagMap._.removePreviousTag = true;
            }
          }
          break;
        default:
          if ($.inArray(event.which, TagsInputConstants.CONFIRM_KEYS) >= 0) {
            if (tagVal.length === 0) {
              return;
            }
            var inputtedTags = splitTags(tagVal);
            for (var i = 0; i < inputtedTags.length; i++) {
              var correctedTagKey = correctTag(inputtedTags[i], ins.fn.corrector);
              if (!isValidTag(correctedTagKey, ins.fn.matcher)) {
                setInvalidCss(ins.dom.$tagInput);
                return;
              }
              ins.addTag(correctedTagKey);
            }
            ins.dom.$tagInput.val('');
            event.preventDefault();
          }
          break;
        }
      });
    }
    function flashDuplicatedTag(tagMap, tag) {
      var tagEntry = tagMap.getEntry(tag);
      if (tagEntry != null) {
        tagEntry.dom.fadeOut(100).fadeIn(100);
      }
    }
    function setValidCss($tagInput) {
      $tagInput.removeClass(TagsInputConstants.ClassCss.INVALID_INPUT);
    }
    function setInvalidCss($tagInput) {
      $tagInput.addClass(TagsInputConstants.ClassCss.INVALID_INPUT);
    }
    function isValidTag(tag, matcher) {
      if (trim(tag).length === 0) {
        return false;
      }
      var isValid = matcher({ tag: tag });
      if (isValid == null) {
        isValid = true;
      }
      return isValid;
    }
    function correctTag(tag, corrector) {
      if (trim(tag).length === 0) {
        return '';
      }
      var correctedTag = corrector({ tag: tag });
      if (correctedTag == null) {
        correctedTag = tag;
      }
      return correctedTag;
    }
    function validateMaxTags($tagInput, $tagListContainer, tagMap) {
      var isMaxTags = tagMap.isMaxTagsExceeded();
      $tagInput.attr('readonly', isMaxTags);
      if (isMaxTags === true) {
        $tagListContainer.addClass(TagsInputConstants.ClassCss.TAGSINPUT_MAX_TAGS);
        $tagInput.addClass(TagsInputConstants.ClassCss.TAGSINPUT_MAX_TAGS);
        $tagInput.attr('placeholder', '');
      } else {
        $tagListContainer.removeClass(TagsInputConstants.ClassCss.TAGSINPUT_MAX_TAGS);
        $tagInput.removeClass(TagsInputConstants.ClassCss.TAGSINPUT_MAX_TAGS);
        $tagInput.attr('placeholder', $tagInput.data('placeholder'));
      }
    }
    function getDataCallback(tagMap, changedTag) {
      var tagList = tagMap.getTagList();
      return {
        totalTags: tagList.length,
        tags: tagList,
        tag: changedTag
      };
    }
    function splitTags(tagString, delimiter) {
      var tagsArr, fixedTags = [];
      if (tagString == null) {
        return [];
      }
      if (delimiter !== '') {
        tagsArr = tagString.split(delimiter);
      } else {
        tagsArr = [tagString];
      }
      for (var i = 0; i < tagsArr.length; i++) {
        fixedTags.push(trim(tagsArr[i]));
      }
      return fixedTags;
    }
    function getDelimiter(d) {
      if (d == null) {
        return TagsInputConstants.DELIMITER;
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
    function trim(str) {
      return str == null ? '' : str.replace(/^\s+|\s+$/g, '');
    }
    return function (scope, element) {
      return new TagsInput(scope, element);
    };
  }
]).directive('tagsinput', [
  '$templateCache',
  'tagsInput',
  'TagsInputConstants',
  function ($templateCache, tagsInput, TagsInputConstants) {
    return {
      replace: true,
      template: function (element, attrs) {
        var templateUrl = attrs.templateUrl == null ? TagsInputConstants.DEFAULT_TEMPLATE : attrs.templateUrl;
        return $templateCache.get(templateUrl);
      },
      scope: {
        tagsinputId: '=?',
        initTags: '=?',
        maxTags: '=?maxtags',
        maxLength: '=?maxlength',
        placeholder: '@',
        delimiter: '@',
        readonly: '@',
        corrector: '&',
        matcher: '&',
        templateUrl: '@',
        onTagsChanged: '&onchanged',
        onTagsAdded: '&onadded',
        onTagsRemoved: '&onremoved',
        onTagsReset: '&onreset'
      },
      link: function (scope, element) {
        var id = scope.tagsinputId == null ? '' : scope.tagsinputId;
        var tagsInputInstance = tagsInput(scope, element);
        if (scope.initTags != null && angular.isArray(scope.initTags)) {
          tagsInputInstance.addTags(scope.initTags);
        }
        scope.$on('tagsinput:add', function (event, tags, tagsinputId) {
          var tagArr = tags;
          if (tagsinputId == null || tagsinputId === id) {
            if (!angular.isArray(tags)) {
              tagArr = [tags];
            }
            tagsInputInstance.addTags(tagArr);
          }
        });
        scope.$on('tagsinput:remove', function (event, tags, tagsinputId) {
          var tagArr = tags;
          if (tagsinputId == null || tagsinputId === id) {
            if (!angular.isArray(tags)) {
              tagArr = [tags];
            }
            tagsInputInstance.removeTags(tagArr);
          }
        });
        scope.$on('tagsinput:clear', function (event, tagsinputId) {
          if (tagsinputId == null || tagsinputId === id) {
            tagsInputInstance.clearTags();
          }
        });
        scope.$on('$destroy', function () {
          tagsInputInstance.clearTags();
        });
      }
    };
  }
]).constant('TagsInputConstants', {
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
    TAGSINPUT: '[data-role=tagsinput]'
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
    $templateCache.put('angularjs/bootstrap/tagsinput/tagsinput.tpl.html', '<div class="angularjs-bootstrap-tagsinput">\n' + '    <div data-role="tags">\n' + '        <span data-role="tag" class="label label-info">\n' + '            <span data-role="value"></span>\n' + '            <span data-role="remove"></span>\n' + '        </span>\n' + '    </div>\n' + '\n' + '    <div class="tagsinput">\n' + '        <input data-role="tagsinput" class="form-control" type="text">\n' + '    </div>\n' + '</div>');
  }
]);