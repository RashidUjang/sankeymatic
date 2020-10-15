// is_numeric: borrowed from jQuery's isNumeric
function is_numeric(n) {
    /* "parseFloat NaNs numeric-cast false positives (null|true|false|"")
       ...but misinterprets leading-number strings, particularly hex literals ("0x...")
       subtraction forces infinities to NaN" */
    return n - parseFloat(n) >= 0;
}

// escape_html: make any input string safe to display
function escape_html(unsafe_string) {
    return unsafe_string
         .replace(/→/g, "&#8594;")
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;")
         .replace(/\n/g, "<br />");
}

// remove_zeroes: Strip off zeros from after any decimal
function remove_zeroes(number_string) {
    return number_string
        .replace( /(\.\d*?)0+$/, '$1' )
        .replace( /\.$/, '');  // If no digits remain, remove the '.' as well.
}

// fix_separators: given a US-formatted number, replace with user's preferred separators:
function fix_separators(n, seps) {
    // If desired format is not the US default, perform hacky-but-functional swap:
    return ( seps.thousands !== ","
        ?  // 3-step swap using ! as the placeholder:
            n.replace(/,/g, "!")
             .replace(/\./g, seps.decimal)
             .replace(/!/g, seps.thousands)
        : n );
}

// format_a_value: produce a fully prefixed, suffixed, & separated number for display:
function format_a_value(number_in, places, separators, prefix, suffix,
    display_full_precision) {
    var number_portion =
        fix_separators(
            d3.format( ",." + places + "f" )(number_in),
            separators );
    return prefix
        + ( display_full_precision
            ? number_portion
            : remove_zeroes(number_portion) )
        + suffix;
}

export {escape_html, is_numeric, remove_zeroes, fix_separators, format_a_value};
