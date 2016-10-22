import hyphenateStyleName from 'fbjs/lib/hyphenateStyleName'

const prefixSubstitutionMap = {}

const prefixedProps = Object.keys(document.body.style)
  .filter((prop) => prop.match(/^webkit|^moz|^ms/))

prefixedProps.forEach(prop => {
  const hyphenatedProp = hyphenateStyleName(prop)
  const prefixedProp = `-${hyphenatedProp}`
  const unPrefixedProp = hyphenatedProp.replace(/^webkit-|^moz-|^ms-/, '')
  Object.assign(prefixSubstitutionMap, { [unPrefixedProp]: prefixedProp })
})

export default root => {
  root.walkDecls(decl => {
    /* No point even checking custom props or props that don't require prefixing*/
    if (decl.prop.startsWith('--') || !prefixSubstitutionMap[decl.prop]) return

    decl.cloneBefore({
      prop: prefixSubstitutionMap[decl.prop],
      value: decl.value,
    })
    decl.remove()
  })
}
