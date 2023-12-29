// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
const fs = require('fs')
const path = require('path')

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "generate-react-component" is now active!'
  )

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let showTime = vscode.commands.registerCommand(
    'generate-react-component.showTime',
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage(new Date().toLocaleTimeString())
    }
  )

  let generateComponent = vscode.commands.registerCommand(
    'generate-react-component.generateComponent',
    async () => {
      const folderName = await vscode.window.showInputBox({
        prompt: 'Enter the folder name for the component',
        placeHolder: 'e.g., button',
      })

      const componentName = await vscode.window.showInputBox({
        prompt: 'Enter the component name',
        placeHolder: 'e.g., Button',
      })

      const ext = await vscode.window.showQuickPick(['js', 'jsx', 'tsx'], {
        placeHolder: 'Select the file extension for the component',
      })

      const styleType = await vscode.window.showQuickPick(['css', 'scss'], {
        placeHolder: 'Select the style type for the component',
      })

      const folderPath = path.join(process.cwd(), folderName)

      try {
        // Create folder
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath)
          console.log(`Created directory: ${folderName}`)

          // Create ComponentName.tsx
          const componentPath = path.join(folderPath, `${componentName}.${ext}`)
          fs.writeFileSync(componentPath, '')
          console.log(`Created file: ${componentName}.${ext}`)

          // Create index.tsx
          const indexPath = path.join(folderPath, `index.${ext}`)
          fs.writeFileSync(indexPath, '')
          console.log(`Created file: index.${ext}`)

          // Create style file based on styleType
          if (styleType === 'css') {
            const cssPath = path.join(folderPath, `${componentName}.css`)
            fs.writeFileSync(cssPath, '')
            console.log(`Created file: ${componentName}.css`)
          } else if (styleType === 'scss') {
            const scssPath = path.join(
              folderPath,
              `${componentName}.module.scss`
            )
            fs.writeFileSync(scssPath, '')
            console.log(`Created file: ${componentName}.module.scss`)
          } else {
            console.error(
              'Invalid styleType. Supported values are "css" or "scss".'
            )
          }

          console.log('Task completed successfully.')
        } else {
          vscode.window.showInformationMessage(
            'Folder already exists. Choose a different folder name.'
          )
          console.error(
            `Folder ${folderPath} already exists. Choose a different folder name.`
          )
        }
      } catch (err: any) {
        vscode.window.showInformationMessage(err.message)
        console.error(`Error: ${err.message}`)
      }
    }
  )

  context.subscriptions.push(showTime, generateComponent)
}

// This method is called when your extension is deactivated
export function deactivate() {
  console.log('Your extension "generate-react-component" is now deactivated!')
}
