angularjs-bootstrap-tagsinput
=============================
Tagsinput was written by Angular JS framework and styled by Bootstrap 3


The features:

- Limit by a number of tags.
- Limit by length of each tag.
- [Corrector] Correct the inputted tag before validate the tag.
- [Matcher] Validate the corrected tag before add to tag list.
- Support placeholder of tagsinput.
- Support to customize the template of the tags.
- Not to add the duplicated tags.
- Press twice BACKSPACE to remove the last tag first time, after that only once.
- Class .tagsinput-invalid will be shown if [matcher] return false.

#### Install ####
---
Via `bower`:

    bower install angularjs-bootstrap-tagsinput


#### How to use ####
---
Use as directive A (attribute) via the name `tagsinput`


#### Properties ####
---
- **tags**: array of tags were added
- **maxtags**: limit by a number of tags
- **maxlength**: limit by a length of tag
- **placeholder**: default text if input nothing
- **template**: your custom template
- **corrector**: tag will be corrected before validate a tag by **matcher**. MUST return a corrected tag.
- **matcher**: after tag was corrected, it must be valid before added. MUST return **TRUE** or **FALSE**.


#### Example ####
---

    <div tagsinput
         tags="dummyTags"
         maxtags="10"
         maxlength="5"
         corrector="corrector(tag)"
         matcher="matcher(tag)"
         placeholder="Please input the phone number"></div>


#### How to customize tagsinput template ####
---

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

MUST have attributes:

- **[data-role="tags"]**: a container contains the tags.
- **[data-role="tag"]**: define a template of a tag.
- **[data-role="value"]**: place to show the text of tag.
- **[data-role="remove"]**: button to remove a tag.
- **[data-role="tagsinput-message"]**: message will be informed before remove the last tag.
- **[data-role="tagsinput"]**: input the tag.