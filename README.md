# What is style scope?
Style scope is a set of add-on functions that makes dealing with style elements and remote stylesheets easier. For most mobile projects, we remove all the desktop styles. However, that blocks access to any background images we might need.  

Desktop iteration projects might find this handy to help deal with the existing desktop styles.  

With this library, you can change styles within a style sheet through adding, editing and removing style attributes, along with pruning stylesheets down to just the essential selectors and attributes you need.

## List of available functions

#### prune_styles("comma separated style attributes")

Removes all styles and selectors that does not have the passed attributes.  

    prune_styles("background")  
Will remove all id and class styles and selectors that do not have the background property.

    prune_styles("background,width,height")  
will save all id and class selectors that contains the background, width and/or height properties (and removes all others)

#### style("css selector")

Scopes you into the style specified by the CSS selector This should be an exact match for the CSS selector, . Within that style scope, you can run the following functions:

#### edit_style("property", "value")

Lets you edit an existing style property.

#### remove_style("property")

Removes that style from the selector

#### add_style("property", "value")

Appends a new style to the end of that selector. E.g. add_style("display","block") adds the display block property to that selector

#### insert_style_before("selector", "css")

When you are scoped into a style, This lets you insert a new style selector and attributes before the CSS style you are currently scoped into. For the CSS argument, add in the styles the same as you would an inline style attribute.  

e.g.  

    style("#foo") {
        insert_style_before("#preFoo", "display: block; border: 1px solid black;")
    }

#### insert_style_after("selector", "css")

When you are scoped into a style, This lets you insert a new style selector and attributes after the CSS style you are currently scoped into.

#### remove_style_important()

Removes use of the css !important from css properties. Can be used in a style() scope or globally

#### rename_selector("new-name")

Changes the CSS selector for the style. E.g. you can change .foo into #bar:

    .foo {
        color: red;
    }

into:  

    #bar {
        color: red;
    }

#### remove_selector()

If you are already scoped into a style, you can remove it completely.

#### remove_selector("selector")

Outside of the style() scope this will remove styles definitions with the matched selector.

#### minify_stylesheet()

Minifies the stylesheet by stripping out newlines, whitespace (before style attributes) and standard CSS comments

#### wrap_media_query("media", "argument", "mediaFeature")

Will wrap whatever its scope is in a media query. If it is a single style, then jsut that style. If the whole stylesheet, then everything will be wrapped in the media query.

A style example:  

    #foo {
      background-color:blue;
    }  

Scope into it and wrap it in a media query:  

    style("#foo") {
        wrap_media_query("screen", "and", "max-width:500px")
    }

Would output:  

    @media screen and (max-width: 500px) {
      #foo {
        background-color:blue;
      }
    }

## Example uses

If the desktop stylesheet I am working with contains this example style:

    .main #content-header-1 {
    	font-size: 48px;
    	color: #336699 !important;
    	text-shadow: 1px 1px 1px silver;
    	line-height: 60px;
    	text-decoration: underline;
    }

You could scope into the style and adjust it:  

    style(".main #content-header-1") {
    	edit_style("font-size", "18px")
    	remove_style("text-decoration")
    	remove_style("text-shadow")
    	edit_style("line-height", "1.4")
    	remove_style_important()
    	add_style("clear", "both")
    }

to output this for use in your project:  

    .main #content-header-1 {
    	font-size: 18px;
    	color: #336699;
    	line-height: 1.4;
    	clear: both;
    }

## Installation

For projects using newer mixers, you can drop the style_scope.ts file into your functions folder. Then include it into your project by adding  

    @import style_scope.ts  

in your functions/main.ts file.  

Depending on your project setup, the external stylesheets may be removed automatically. You will want to flag them to prevent removal and rewrite the URL to pass through the SDK.  

Most style sheets will be served with a mime type "text/css". In scripts/main.ts, you will want to have an option to handle css:   
    
    match($inferred_content_type) { 
    ...
    with(/css/) {  
      # Proved URL mappings for the style sheets  
      match($path) {  
        with(/path\/to\/style\/sheet.css) {  
          #import a file to hold your stylesheet transformations
          @import "file/to/transform_stylesheet.ts"
        }  
      }  
    }
