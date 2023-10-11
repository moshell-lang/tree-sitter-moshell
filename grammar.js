const commaSep = (rule) => seq(rule, repeat(seq(',', rule)));

module.exports = grammar({
  name: 'moshell',
  extras: $ => [
    /\s/,
    /\\\r?\n/,
    $.line_comment,
    $.block_comment,
  ],
  word: $ => $.identifier,
  rules: {
    source_file: $ => optional($._declarations),

    _declarations: $ => seq(
      repeat(seq(
        $._declaration,
        $._terminator
      )),
      $._declaration,
      optional($._terminator)
    ),
    _declaration: $ => choice(
      $.function_declaration,
      $.use_declaration,
      $.variable_declaration,
      $._statement,
      $.return,
      'break',
      'continue',
    ),
    function_declaration: $ => seq(
      'fun',
      field('name', $.identifier),
      field('parameters', $.parameter_list),
      optional(seq(
        '->',
        field('return_type', $.type_identifier)
      )),
      '=',
      $._expression
    ),
    parameter_list: $ => seq(
      '(',
      optional(commaSep($.function_parameter)),
      ')'
    ),
    function_parameter: $ => seq(
      $.identifier,
      ':',
      $.type_identifier
    ),
    use_declaration: $ => seq(
      'use',
      $._use_clause,
    ),
    _use_clause: $ => seq(
      $.identifier,
      repeat(seq('::', $.identifier)),
      optional(seq('as', $.identifier)),
    ),
    variable_declaration: $ => seq(
      choice('var', 'val'),
      $.identifier,
      optional(seq(':', $.type_identifier)),
      optional(seq('=', $._expression))
    ),
    command: $ => seq(
      $.command_name,
      repeat($._argument),
      repeat($.redirection),
    ),

    _statement: $ => choice(
      $.command,
      $.pipeline,
      $.while,
      seq('!', $.command),
      $._expression,
    ),
    while: $ => seq(
      'while',
      $._statement,
      $.block
    ),
    return: $ => seq(
      'return',
      optional($._expression)
    ),

    _expression: $ => choice(
      $.block,
      $.if,
      $.call_expression,
      $.assignation,
      $.infix_expression,
      $.prefix_expression,
      $.parentherized_expression,
      $.expansion,
      $.primary
    ),
    block: $ => seq(
      '{',
      optional($._declarations),
      '}'
    ),
    if: $ => seq(
      'if',
      field('condition', $._statement),
      field('then', $.block),
      optional(seq(
        'else',
        field('else', $.block)
      ))
    ),
    call_expression: $ => seq(
      field('name', $.identifier),
      field('arguments', $.argument_list),
    ),
    argument_list: $ => seq(
      '(',
      optional($._expression),
      repeat(seq(',', $._expression)),
      ')'
    ),
    assignation: $ => prec.right(seq(
      choice($.identifier, $._expression),
      choice('=', '+=', '-=', '*=', '/=', '%='),
      $._expression
    )),
    cast_expression: $ => prec.left(seq(
      field('value', $._expression),
      'as',
      field('type', $.type_identifier)
    )),
    infix_expression: $ => prec.left(seq(
      $._expression,
      choice('+', '-', '*', '/', '%', '==', '!=', '<', '>', '<=', '>=', '&&', '||', 'in'),
      $._expression
    )),
    prefix_expression: $ => prec.right(seq(
      choice('!', '-'),
      $._expression
    )),
    parentherized_expression: $ => seq(
      '(',
      $._expression,
      ')'
    ),

    expansion: $ => choice(
      $.variable,
      $.command_substitution
    ),
    pipeline: $ => prec.left(seq(
      $._statement,
      '|',
      $._statement
    )),
    redirection: $ => seq(
      field('descriptor', optional($.number)),
      choice('<', '>', '>>', '<<<', '&>', '&>>', '<&', '>&'),
      field('destination', $._argument)
    ),
    command_substitution: $ => seq('$(', $._declaration, ')'),

    command_name: $ => $.identifier,
    _argument: $ => choice(
      $.raw_string,
      $.template_string,
      $.expansion,
      $.word
    ),

    primary: $ => choice(
      $.number,
      $.boolean,
      $.raw_string,
      $.template_string,
    ),
    line_comment: $ => token(seq('//', /.*/)),
    block_comment: $ => token(seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/')),
    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,
    word: $ => /[^#'"\\\s$<>{}&;()]+/,
    number: $ => /\d+/,
    boolean: $ => choice('true', 'false'),
    template_string: $ => seq(
      '"',
      repeat(choice($._string_content, $.expansion)),
      '"'
    ),
    raw_string: $ => /'[^']*'/,
    _string_content: $ => token(prec(-1, /([^"`$\\]|\\(.|\r?\n))+/)),
    _terminator: $ => choice(';', '\n'),
    type_identifier: $ => $.identifier,
    variable: $ => seq(
      '$',
      $.identifier
    ),
  }
});
