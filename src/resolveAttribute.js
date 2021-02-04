// 默认styleName
export function defaultObjectAttribute ({ path, types, stylesId }) {
  path.get('value').replaceWith(
    types.memberExpression(
      stylesId,
      types.identifier(path.node.value.value)
    )
  )
}

export const solveObjectAttribute = ({ path, types, stylesId }) => {
  // 查找class属性
  const classNode = path.container.find(node => node.key.name === 'class');

  // class 属性不存在
  if (!classNode) {
    const property = types.objectProperty(
      types.identifier('class'),
      types.memberExpression(
        stylesId,
        types.identifier(path.node.value.value)
      )
    );

    path.container.push(property);
    path.remove();
    return;
  }

  solveMultipleValue({
    styleNamePathValue: path.node.value,
    classAttributeValue: classNode.value,
    classAttribute: classNode,
    types,
    stylesId,
    isJSX: false
  });
  path.remove();
}

// 处理不同类型表达式的值， 对象， 数组，字符串...
function solveMultipleValue ({
  styleNamePathValue,
  classAttribute,
  classAttributeValue,
  types,
  stylesId,
  isJSX = true
}) {

  // 对象表达式
  if (types.isObjectExpression(classAttributeValue)) {
    const property = types.objectProperty(
      types.memberExpression(
        stylesId,
        types.identifier(styleNamePathValue.value)
      ),
      types.booleanLiteral(true),
      true
    );
      
    classAttributeValue.properties.push(property);
    
    // 数组表达式
  } else if(types.isArrayExpression(classAttributeValue)) {
    classAttributeValue.elements.push(
      types.memberExpression(
        stylesId,
        types.identifier(styleNamePathValue.value)
      )
    );

    // 其他，权当字符串看待
  } else {
    let value = resolveStringValue({ 
      types, 
      classAttributeValue, 
      styleNamePathValue, 
      stylesId 
    });

    if (isJSX) {
      value = types.jsxExpressionContainer(value);
    }

    classAttribute.value = value;
  }
}

// 获取字符串拼接表达式
function resolveStringValue ({ types, classAttributeValue, styleNamePathValue, stylesId }) {
  return types.binaryExpression(
    '+', 
    types.binaryExpression(
      '+',
      classAttributeValue,
      types.stringLiteral(' ')
    ),
    types.memberExpression(
      stylesId,
      types.identifier(styleNamePathValue.value)
    )
  )
}