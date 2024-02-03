const getSnippet = (componentName: string, styleType: string) => {
  if (styleType === 'css') {
    return `import React from 'react';

import './${componentName}.css'

const ${componentName} = () => {
  return (
    <div className="${componentName.toLowerCase()}">
      ${componentName}
    </div>
  );
}

export default ${componentName};
`
  } else if (styleType === 'scss') {
    return `import React from 'react';

import stl from './${componentName}.module.scss'

const ${componentName} = () => {
  return (
    <div className={stl.${componentName.toLowerCase()}}>
      ${componentName}
    </div>
  );
}

export default ${componentName};
`
  } else if (styleType === 'tailwind') {
    return `import React from 'react';

const ${componentName} = () => {
  return (
    <div className="text-red-500">
      ${componentName}
    </div>
  );
}

export default ${componentName};
`
  }
}

const getStyleSnippet = (componentName: string, styleType: string) => {
  if (styleType === 'css' || styleType === 'scss') {
    return `.${componentName.toLowerCase()} {
  color: red;
}
`
  } else return ''
}

const getExportSnippet = (componentName: string) => {
  return `import ${componentName} from './${componentName}'

export default ${componentName}
`
}

export { getSnippet, getStyleSnippet, getExportSnippet }
