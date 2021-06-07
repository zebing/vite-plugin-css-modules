import { NodeTypes } from '@vue/compiler-core';
import { isArray, isObject } from './shared';
import {
  CodegenResult,
  baseParse,
  parserOptions,
  transform,
  generate,
  CompilerOptions,
  transformExpression,
  trackVForSlotScopes,
  trackSlotScopes,
  noopDirectiveTransform,
  transformBind,
  transformStyle
} from '@vue/compiler-dom'
import { ssrCodegenTransform } from './ssrCodegenTransform'
import { ssrTransformElement } from './transforms/ssrTransformElement'
import {
  ssrTransformComponent,
  rawOptionsMap
} from './transforms/ssrTransformComponent'
import { ssrTransformSlotOutlet } from './transforms/ssrTransformSlotOutlet'
import { ssrTransformIf } from './transforms/ssrVIf'
import { ssrTransformFor } from './transforms/ssrVFor'
import { ssrTransformModel } from './transforms/ssrVModel'
import { ssrTransformShow } from './transforms/ssrVShow'
import { ssrInjectFallthroughAttrs } from './transforms/ssrInjectFallthroughAttrs'
import { ssrInjectCssVars } from './transforms/ssrInjectCssVars'

export function transformTemplateAsModule (template: any, options: any) {
  const { tokens, styleName, stylesId } = options;
  const parseOptions = {
    ...template,
    // apply DOM-specific parsing options
    ...parserOptions,
    ssr: true,
    scopeId: null,
    // always prefix since compiler-ssr doesn't have size concern
    prefixIdentifiers: true,
    // disable optimizations that are unnecessary for ssr
    cacheHandlers: false,
    hoistStatic: false,
  }

  const ast = baseParse(template.code, parseOptions);

  ast.children.forEach((element: any) => {
    resolveClassContent({ element, tokens, styleName, stylesId });
  });

  rawOptionsMap.set(ast, parseOptions)

  transform(ast, {
    ...parseOptions,
    nodeTransforms: [
      ssrTransformIf,
      ssrTransformFor,
      trackVForSlotScopes,
      transformExpression,
      ssrTransformSlotOutlet,
      ssrInjectFallthroughAttrs,
      ssrInjectCssVars,
      ssrTransformElement,
      ssrTransformComponent,
      trackSlotScopes,
      transformStyle,
      ...(options.nodeTransforms || []) // user transforms
    ],
    directiveTransforms: {
      // reusing core v-bind
      bind: function (dir: any, node, context) {
        // 去除vue 自动添加的_ctx.前缀
        if (dir.isCustom) {
          dir.exp.children = dir.exp.children.map((subNode: any) => {
            if (isObject(subNode) && /^_ctx\./.test(subNode.content)) {
              subNode.content = subNode.content.replace('_ctx.', '');
            }

            return subNode;
          });
        }
        return transformBind(dir, node, context)
      },
      // model and show has dedicated SSR handling
      model: ssrTransformModel,
      show: ssrTransformShow,
      // the following are ignored during SSR
      on: noopDirectiveTransform,
      cloak: noopDirectiveTransform,
      once: noopDirectiveTransform,
      ...(parseOptions.directiveTransforms || {}) // user transforms
    }
  })

  // traverse the template AST and convert into SSR codegen AST
  // by replacing ast.codegenNode.
  ssrCodegenTransform(ast, parseOptions)
  
  return generate(ast, parseOptions)
}

function resolveClassContent ({ element, tokens, styleName, stylesId }: any) {
  if (element.type !== NodeTypes.ELEMENT) {
    return;
  }
  
  let classTag = getElement('class', element);
  let styleNameTag;

  if (styleName !== 'class') {
    styleNameTag = getElement(styleName, element);
  }

  // class 不存在,  [stylename]存在
  if (!classTag) {
    if (styleNameTag) {
      const originName = styleNameTag.value.content;
      const node = tokens[originName] 
        ? genBindDirectiveNode(`${stylesId.name}.${styleNameTag.value.content}`, styleNameTag.loc)
        : genBindTextNode(originName, styleNameTag.loc);
      element.props.push(node);
    }

    // class 存在
  } else {

    // [stylename]存在
    if (styleNameTag) {
      classTag = mergeClass({ classTag, styleNameTag, stylesId, tokens })
    }

    if (classTag) {
      element.props.push(classTag);
    }
  }

  element.children.forEach((element: any) => {
    resolveClassContent({ element, tokens, styleName, stylesId });
  });
}

// 合并class和classname
function mergeClass ({ classTag, styleNameTag, stylesId, tokens }: any) {
  const styleNameTagContent = styleNameTag.value.content;
  
  // 静态属性
  if (classTag.type === NodeTypes.ATTRIBUTE) {
    classTag = tokens[styleNameTagContent] 
      ? genBindDirectiveNode(
        '`' + classTag.value.content +' ${'+ stylesId.name + '.' +styleNameTagContent +'}`',
          styleNameTag.loc
        )
      : genBindTextNode(`${classTag.value.content} ${styleNameTagContent}`, styleNameTag.loc);

  } else if (classTag.type === NodeTypes.DIRECTIVE) {
    const result = evaler(classTag.exp.content);
    const className = tokens[styleNameTagContent] 
      ? `${stylesId.name}.${styleNameTagContent}`
      : styleNameTagContent;

    if (isObject(result)) {
      classTag = genBindDirectiveNode(
        classTag.exp.content.replace(
          '}', 
          `,[${className}]:true}`
        ),
        styleNameTag.loc
      );

    } else if (isArray(result)){
      classTag = genBindDirectiveNode(
        classTag.exp.content.replace(
          ']', 
          ', `${' + className + '}`]'
        ),
        styleNameTag.loc
      );

    } else {
      classTag = genBindDirectiveNode(
        '`${'+ classTag.exp.content +'} ${'+ className +'}`',
        styleNameTag.loc
      );
    }
  }

  return classTag;
}

// 获取prop属性对象
function getElement (name: string, element: any) {
  let index;
  const result = element.props.find((prop: any, key: number) => {
    if (
      (prop.type === NodeTypes.ATTRIBUTE && prop.name === name) ||
      (prop.type === NodeTypes.DIRECTIVE && prop.arg.content === name)
    ) {
      index = key;
      return true;
      // 指令
    }
  });

  if (result) {
    element.props.splice(index, 1);
  }

  return result;
}

function evaler(str: any){
  return Function('"use strict";return (' + str + ')')();
}

// 构建bind 静态节点
function genBindTextNode (content: any, loc: any) {
  return {
    type: NodeTypes.ATTRIBUTE,
    name: 'class',
    value: {
      type: NodeTypes.TEXT,
      content,
      loc: loc
    },
    loc
  }
}

// 构建bind directive节点
function genBindDirectiveNode (content: any, loc: any) {
  return {
    type: NodeTypes.DIRECTIVE,
    name: 'bind',
    isCustom: true, // 自定义标记
    exp: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      constType: 0,
      content,
      isStatic: false,
      isConstant: false,
      loc
    },
    arg: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      constType: 3,
      content: 'class',
      isStatic: true,
      isConstant: false,
      loc
    },
    modifiers: [],
    loc
  };
}
