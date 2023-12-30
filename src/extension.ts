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
      // @ts-ignore
      let workspacePath
      if (
        vscode.workspace.workspaceFolders &&
        vscode.workspace.workspaceFolders.length > 0
      ) {
        workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath
      } else {
        vscode.window.showErrorMessage('No workspace is open.')
        return
      }

      const componentPath = await vscode.window.showInputBox({
        prompt: 'Enter the path for the component',
        placeHolder: 'e.g., src/components',
      })

      const componentFullPath = path.join(workspacePath, componentPath)

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

      const styleType = await vscode.window.showQuickPick(
        ['css', 'scss', 'tailwind'],
        {
          placeHolder: 'Select the style type for the component',
        }
      )

      if (!fs.existsSync(componentFullPath)) {
        console.log('Path does not exist')
        const normalizedPath = path.normalize(componentPath)
        const parts = normalizedPath.split(path.sep)

        let currentPath = ''

        for (const part of parts) {
          if (parts[0] === part) {
            currentPath = path.join(workspacePath, part)
          } else {
            currentPath = path.join(currentPath, part)
          }

          if (!fs.existsSync(currentPath)) {
            fs.mkdirSync(currentPath)
          }
        }

        console.log(`Path creation complete: ${componentFullPath}`)
      }

      const folderPath = path.join(componentFullPath, folderName)

      try {
        // Create folder
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath)

          // Create ComponentName.tsx
          const componentPath = path.join(folderPath, `${componentName}.${ext}`)
          fs.writeFileSync(componentPath, '')

          // Create index.tsx
          const indexPath = path.join(folderPath, `index.${ext}`)
          fs.writeFileSync(indexPath, '')

          // Create style file based on styleType
          switch (styleType) {
            case 'css':
              const cssPath = path.join(folderPath, `${componentName}.css`)
              fs.writeFileSync(cssPath, '')
              break
            case 'scss':
              const scssPath = path.join(
                folderPath,
                `${componentName}.module.scss`
              )
              fs.writeFileSync(scssPath, '')
              break
            case 'tailwind':
              break
            default:
              vscode.window.showErrorMessage(
                'Invalid styleType. Supported values are "css", "scss" or "tailwind".'
              )
              break
          }

          vscode.window.showInformationMessage(
            'Component generated successfully.'
          )
        } else {
          vscode.window.showErrorMessage(
            'Folder already exists. Choose a different folder name.'
          )
          console.error(
            `Folder ${folderPath} already exists. Choose a different folder name.`
          )
        }
      } catch (err: any) {
        vscode.window.showErrorMessage(err.message)
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
