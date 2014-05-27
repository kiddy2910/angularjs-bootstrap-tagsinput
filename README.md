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
- Not to add the duplicated tags
- Press twice **BACKSPACE** to remove the last tag first time, after that only once
- Support 3 callback events `onchanged`, `onadded` and `onremoved` (>=0.2.0)
- Support 3 events `tagsinput:add`, `tagsinput:remove]` and `tagsinput:clear` (>=0.2.0)

---

#### Install ####

Via `bower`:

    bower install angularjs-bootstrap-tagsinput

---

#### How to use ####

Use as directive A (attribute) via the name `tagsinput`

---

#### Properties ####

All properties are optional.

- **tags**: array of tags were added in the beginning
- **maxtags**: limit by a number of tags
- **maxlength**: limit by a length of tag
- **placeholder**: default text if input nothing
- **template**: your custom template
- **corrector**: tag will be corrected before validate a tag by **matcher**. MUST return a corrected tag.
- **matcher**: after tag was corrected, it must be valid before added. MUST return **TRUE** or **FALSE**.
- **onchanged**: always occurs once tagList was changed (add or remove, not clear). Argument **data = { totalTags, tags, tag }** was passed to callback
- **onadded**: occurs once new tag was added to tagList. Argument **data = { totalTags, tags, tag }** was passed to callback
- **onremoved**: occurs once tag was removed out of tagList. Argument **data = { totalTags, tags, tag }** was passed to callback

---

#### Events ####

- `tagsinput:add` accepts one argument **tag** to add to tagList
- `tagsinput:remove` accepts one argument **tag** to remove it out of tagList
- `tagsinput:clear` clear tagList

---

#### Css classes ####

- **tagsinput-invalid**: will be added to input if **matcher** return false
- **tagsinput-maxtags**: will be added to tagList if tagList reached the maximum amount of tags (>=0.2.0)

---

#### Example ####

    <div tagsinput tags="initPhoneNumbers"
        maxtags="10" maxlength="15"
        placeholder="Please input the phone number"
        corrector="correctPhoneNumber(tag)"
        matcher="validatePhoneNumber(tag)"
        onchanged="onTagsChange(data)"
        onadded="onTagsAdded(data)"
        onremoved="onTagsRemoved(data)"></div>

---

#### How to customize tagsinput template ####

    <div class="angularjs-bootstrap-tagsinput">
        <div data-role="tags">
            <span data-role="tag" class="label label-info">
                <span data-role="value"></span>
                <span data-role="remove"></span>
            </span>
        </div>

        <div data-role="tagsinput-message">Press BACKSPACE again to delete the last tag.</div>

        <div class="tagsinput">
            <input data-role="tagsinput" class="form-control" type="text">
        </div>
    </div>

**MUST have attributes:**

- **[data-role="tags"]**: a container contains the tags.
- **[data-role="tag"]**: define a template of a tag.
- **[data-role="value"]**: place to show the text of tag.
- **[data-role="remove"]**: button to remove a tag.
- **[data-role="tagsinput-message"]**: message will be informed before remove the last tag.
- **[data-role="tagsinput"]**: input the tag.