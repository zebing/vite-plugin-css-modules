export default function traverseSSR ({ html, styleName, tokens, stylesId }) {
    function replace(matcher) {
        const context = matcher.split('=');
        const value = context[1].slice(1, -1);
        return tokens[value] 
            ? 'class="${_ssrRenderClass('+ stylesId.name + '.' + value +')}"'
            : 'class=' + value;
    }

    return html.replace(new RegExp(`${styleName}="[_$a-z0-9]+"`, 'gi'), replace)
}

