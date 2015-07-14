## CSS ripper functions
#$mw_css_capture = ""
# version 0.1.0


@func XMLNode.proxy_style(Text %stylesheet_url) {
 $(%stylesheet_url) {
   attribute("rel") {
     value() {
       replace(/^https?:/, "")
       replace(/^\/\//, "")
       replace(/^[^\/]+/)
     }
   }
   attributes(data-mw-keep:"true")
 }
}

@func XMLNode.proxy_style() {
  attribute("rel") {
    value() {
      replace(/^https?:/, "")
      replace(/^\/\//, "")
      replace(/^[^\/]+/)
    }
  }
  attributes(data-mw-keep:"true")
}

#@func Text.all_styles() {
#  capture(/([\.\#][^{^;]+\s+{[^}]+})/) {
#    #log(%1)
#    yield()
#  }
# #set($mw_css_capture)
#}

@func Text.style(Text %selector) {
  capture(regexp(concat("(",%selector,"\\s*{[^}]+}",")"))) {
    # log(%1)
    yield()
  }
}

@func Text.rename_selector(Text %new_name) {
  replace(/^\s*[^{]+{/, concat(%new_name, " {"))
}

@func Text.add_style(Text %key, Text %value) {
  replace(/\}/, %key + ": "+ %value + ";\n}")
}

@func Text.remove_selector() {
  #log("remove selector")
  #log(this())
  replace(/^.*$/, "")
}

@func Text.remove_selector(Text %selector) {
  #log("remove selector")
  #log(this())
  replace(regexp(concat("(",%selector,"\\s*{[^}]+}",")")), "")
}

@func Text.remove_style(Text %key) {
  replace(regexp(concat("\\s*[^-]",%key, "\\s*:[^;]+;\\n?")), "")
}

@func Text.edit_style(Text %key, Text %newvalue) {
  replace(regexp(concat("\\s*[^-]",%key, "\\s*:[^;]+;")), %key + ": "+ %newvalue + ";")
}

@func Text.remove_style_important() {
  replace(/\s*!important/, "")
}

@func Text.insert_style_before(Text %selector, Text %styles) {
  prepend(%selector +"{"+%styles+"}\n\n")
}

@func Text.insert_style_after(Text %selector, Text %styles) {
  append("\n\n"+%selector +"{"+%styles+"}")
}

@func Text.style_prune(Text %styles_to_keep) {
  %sean = ""
  capture(/([\.\#][^{^;]+)\s+{([^}]+)}/) {
    #log(%1)
    %style_selector = %1
    %style_attributes = %2
    #log("=======")
    #log(%style_selector)
    #log(%style_attributes)
    %2 {
      %sean {append(%style_selector+ " {\n")}
      %styles_to_keep {
        capture(/([^,]+)/) {
          #log("matched style attributes:")
          #log(%1)
          %1 {
            %style_attributes {
              capture(regexp(concat("(\\s*", %1, "\\s*:[^;]+;)"))) {
                %sean {append(%1)}
              }
            }
          }
        }
      }
      %sean {append("\n}\n")}
    }
  }
  # clean up empty styles
  %sean {
    replace(/([\.\#][^{^;]+)\s+{([\s]+)}\n?/, "")
  }
  #log(%sean)
  set(%sean)
}
