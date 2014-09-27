angularjs-bootstrap-tagsinput
=============================
Tagsinput was written by Angular JS framework and styled by Bootstrap 3


The features:

- Limit by a number of tags
- Limit by length of each tag
- **Corrector** Correct the inputted tag before validate the tag
- **Matcher** Validate the corrected tag before add to tag list
- Support placeholder of tagsinput
- Support to customize the template of the tags
- Allow to add a list of tags from a delimited string
- Not to add the duplicated tags
- ReadOnly mode disables to input
- Press twice **BACKSPACE** to remove the last tag first time, after that only once
- Support 4 callback events `onchanged`, `onadded`, `onremoved` and `onreset` (>=0.2.0)
- Support 3 events `tagsinput:add`, `tagsinput:remove` and `tagsinput:clear` accept one or more tags (>=0.2.0)

---

#### Install ####

Via `bower`:

    bower install angularjs-bootstrap-tagsinput

---

#### How to use ####

Use as directive A (attribute) via the name `tagsinput`

---

#### Properties ####

All HTML attributes are optional.

- `tagsinput-id`: id of tagsinput. Use in case of firing events
- `init-tags`: array of tags were added in the beginning, deprecated in >= 0.2.0
- `maxtags`: limit by a number of tags
- `maxlength`: limit by a length of tag
- `placeholder`: default text if input nothing
- `delimiter`: default comma (`,`). Pass `false` to disable to split tags
- `readonly`: default `false`. Pass `true` to disable to input
- `template-url`: your custom template url (in $templateCache)
- `corrector`: tag will be corrected before validate a tag by **matcher**. MUST return a corrected tag
- `matcher`: after tag was corrected, it must be valid before added. MUST return **true` or **false**
- `onchanged(data*)`: always occurs whenever tag list was changed (add or remove, not clear)
- `onadded(data)`: occurs whenever new tag was added to tag list
- `onremoved(data)`: occurs whenever tag was removed out of tag list
- `onreset`: occurs whenever fire event `tagsinput:clear`

*data arguments in callbacks is an object with three properties: { totalTags, tags, tag }

---

#### Events ####

- `tagsinput:add` add one or more tags, accepts two arguments (**tags**, **tagsinput-id**) with **tags** can be a string or an array of tags
- `tagsinput:remove` remove one or more tags, accepts two arguments (**tags**, **tagsinput-id**) with **tags** can be a string or an array of tags
- `tagsinput:clear` clear all tags, accepts one argument (**tagsinput-id**)

---

#### CSS classes ####

- `tagsinput-invalid`: will be added to input [data-role=tagsinput] if **matcher** return false
- `tagsinput-maxtags`: will be added to [data-role=tags] and [data-role=tagsinput] if tag list reached the maximum amount of tags (>=0.2.0)

---

#### Example ####

    <div tagsinput
        tagsinput-id="tagsProperties.tagsinputId"
        init-tags="tagsProperties.initTags"
        maxtags="tagsProperties.maxTags"
        maxlength="tagsProperties.maxLength"
        placeholder="tagsProperties.placeholder"
        delimiter=","
        readonly="true"
        corrector="correctPhoneNumber(tag)"
        matcher="validatePhoneNumber(tag)"
        onchanged="onTagsChange(data)"
        onadded="onTagsAdded(data)"
        onremoved="onTagsRemoved(data)"
        onreset="onTagsReset()"></div>

    $scope.tagsProperties = {
        tagsinputId: '$$$',
        initTags: ['+84111111111', '+84222222222', '+84333333333', '+84444444444', '+84555555555'],
        maxTags: 10,
        maxLength: 15,
        placeholder: 'Please input the phone number'
    };

---

#### How to customize tagsinput template ####

    <div class="angularjs-bootstrap-tagsinput">
        <div data-role="tags">
            <span data-role="tag" class="label label-info">
                <span data-role="value"></span>
                <span data-role="remove"></span>
            </span>
        </div>
        <div class="tagsinput">
            <input data-role="tagsinput" class="form-control" type="text">
        </div>
    </div>

**MUST have attributes:**

- `[data-role=tags]`: a container contains the tags.
- `[data-role=tag]`: define a template of a tag.
- `[data-role=value]`: place to show the text of tag.
- `[data-role=remove]`: button to remove a tag.
- `[data-role=tagsinput]`: input the tag.

Change Logs
===
### Version 0.2.0 ###
- Accept 4 attributes `onchanged`, `onadded`, `onremoved`, and `onreset`
- Support 3 events `tagsinput:add`, `tagsinput:remove` and `tagsinput:clear`
- Add class tagsinput-maxtags to [data-role=tags] and [data-role=tagsinput] when reach the max tags
- Resolve the issues #1, #2, #3, #7, #8, #10

### Version 0.1.0 ###
- Limit by a number of tags.
- Limit by length of each tag.
- `corrector` Correct the inputted tag before validate the tag.
- `matcher` Validate the corrected tag before add to tag list.
- Support placeholder of tagsinput.
- Support to customize the template of the tags.
- Not to add the duplicated tags.
- Press twice BACKSPACE to remove the last tag first time, after that only once.
- Class .tagsinput-invalid will be shown if [matcher] return false.
