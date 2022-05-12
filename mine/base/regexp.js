var re,
    // 去字符串两边的空格用的
    rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

// Used for matching numbers
    core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

// Used for splitting on whitespace
    core_rnotwhite = /\S+/g,

// 匹配：#id
    risSimple = /^.[^:#\[\.,]*$/,

// A simple way to check for HTML strings
// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
// Strict HTML recognition (#11290: must start with <)
    rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, // 匹配"#swrapp" 或者 "<div>


// 用于解析html， $.parseHtml
    rsingleTag = (/^<(\w+)\s*\/?>(?:<\/\1>|)$/),

// 转驼峰
    rmsPrefix = /^-ms-/,
    rdashAlpha = /-([\da-z])/gi
