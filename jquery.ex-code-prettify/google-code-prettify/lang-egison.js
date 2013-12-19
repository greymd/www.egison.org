// Copyright (C) 2008 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.



/**
 * @fileoverview
 * Registers a language handler for Common Lisp and related languages.
 *
 *
 * To use, include prettify.js and this file in your HTML page.
 * Then put your code in an HTML tag like
 *      <pre class="prettyprint lang-lisp">(my lisp code)</pre>
 * The lang-cl class identifies the language as common lisp.
 * This file supports the following language extensions:
 *     lang-cl - Common Lisp
 *     lang-el - Emacs Lisp
 *     lang-lisp - Lisp
 *     lang-scm - Scheme
 *     lang-lsp - FAT 8.3 filename version of lang-lisp.
 *
 *
 * I used http://www.devincook.com/goldparser/doc/meta-language/grammar-LISP.htm
 * as the basis, but added line comments that start with ; and changed the atom
 * production to disallow unquoted semicolons.
 *
 * "Name"    = 'LISP'
 * "Author"  = 'John McCarthy'
 * "Version" = 'Minimal'
 * "About"   = 'LISP is an abstract language that organizes ALL'
 *           | 'data around "lists".'
 *
 * "Start Symbol" = [s-Expression]
 *
 * {Atom Char}   = {Printable} - {Whitespace} - [()"\'']
 *
 * Atom = ( {Atom Char} | '\'{Printable} )+
 *
 * [s-Expression] ::= [Quote] Atom
 *                  | [Quote] '(' [Series] ')'
 *                  | [Quote] '(' [s-Expression] '.' [s-Expression] ')'
 *
 * [Series] ::= [s-Expression] [Series]
 *            |
 *
 * [Quote]  ::= ''      !Quote = do not evaluate
 *            |
 *
 *
 * I used <a href="http://gigamonkeys.com/book/">Practical Common Lisp</a> as
 * the basis for the reserved word list.
 *
 *
 * @author mikesamuel@gmail.com
 */

PR['registerLangHandler'](
    PR['createSimpleLexer'](
        [
         // A line comment that starts with ;
         [PR['PR_COMMENT'], /^;[^\r\n]*/, null, ';'],
         // Whitespace
         [PR['PR_PLAIN'], /^[\t\n\r ]+/, null, '\t\n\r '],
         // A double quoted, possibly multi-line, string.
         [PR['PR_STRING'], /^\"(?:[^\"\\]|\\[\s\S])*(?:\"|$)/, null, '"'],
         [PR['PR_STRING'], /^'(?:[^'\\]|\\[\s\S])*(?:'|$)/, null, '\'']
        ],
        [
         [PR['PR_LITERAL'], /^[+\-]?(?:[0#]x[0-9a-f]+|\d+\/\d+|(?:\.\d+|\d+(?:\.\d*)?)(?:[ed][+\-]?\d+)?)/i],
         [PR['PR_KEYWORD'], /^(define|test|execute|main|lambda|let|letrec|if|match-all|match|matcher|algebraic-data-matcher|match-lambda|pattern-function|something)\b/, null],
         // A single $ possibly followed by a word that optionally ends with = ! or ?.
         // Using PR_ATTRIB_NAME instead of PR_VARIABLE.
         [PR['PR_ATTRIB_NAME'], /^\$(?:-*(?:\w|\\[\x21-\x7e])(?:[\w-]*|\\[\x21-\x7e])[=!?]?)?/],
         // Using PR_TAG instead of PR_KEYWORD for these characters.
         [PR['PR_TAG'], /^[\_,@]/, null],
         // A printable non-space non-special character.
         [PR['PR_PUNCTUATION'], /^[\(\)<>\[\]\{\}\\;]+/],
         // A normal word.
         [PR['PR_PLAIN'], /^[^\t\n\r \(\)<>\[\]\{\}\\;]+/]
        ]),
    ['egison' ,'egi']);