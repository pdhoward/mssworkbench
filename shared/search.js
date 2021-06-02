exports.SearchStyle = `case-sensitive` | `regex` | ``

exports.Includes = (text, pattern, searchStyle) =>{
    switch (searchStyle) {
        case `case-sensitive`:
            return text.includes(pattern)
        case `regex`:
            try {
                const re = new RegExp(pattern)
                return re.test(text)
            } catch (SyntaxError) {
                return false
            }
        default:
            return text.toLowerCase().includes(pattern.toLowerCase())
    }
}