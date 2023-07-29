; Literals

(raw_string) @string
(template_string) @string
(number) @number
(command_name) @function.macro
(expansion) @embedded

; Functions

(function_declaration
  name: (identifier) @function)
(function_parameter (identifier) @variable.parameter)
(call_expression
  name: (identifier) @function)

(line_comment) @comment
(block_comment) @comment

; Punctuation and operators

"(" @punctuation.bracket
")" @punctuation.bracket
"{" @punctuation.bracket
"}" @punctuation.bracket
":" @punctuation.delimiter
"::" @punctuation.delimiter
"," @punctuation.delimiter
";" @punctuation.delimiter

[
  "+"
  "-"
  "*"
  "/"
  "%"
  "="
  "+="
  "-="
  "*="
  "/="
  "%="
  "<"
  "<="
  ">"
  ">="
  "&&"
  "||"
  "!"
  "|"
] @operator

; Identifiers

(type_identifier) @type
[
    "as"
    "break"
    "continue"
    "else"
    "fun"
    "if"
    "in"
    "return"
    "use"
    "val"
    "var"
    "while"
] @keyword
[
    "true"
    "false"
] @constant.builtin
