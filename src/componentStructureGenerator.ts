import * as vscode from 'vscode'
const fs = require('fs')
const path = require('path')
import { extensioName } from './constant'
import setPreferencesCommand from './preferences'

const generateComponentStructure = vscode.commands.registerCommand(
  `${extensioName}.generateComponentStructure`,
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

    const config = await vscode.workspace.getConfiguration(extensioName)
    // Retrieve "ext" and "styleType" from the workspace configuration
    let ext = await config.get('ext')
    let styleType = await config.get('styleType')

    let componentPath = ''

    componentPath = (await vscode.window.showInputBox({
      prompt: 'Enter the path for the component',
      placeHolder: 'e.g., src/components',
    })) as string

    const componentFullPath = path.join(workspacePath, componentPath)

    const folderName = await vscode.window.showInputBox({
      prompt: 'Enter the folder name for the component',
      placeHolder: 'e.g., button',
    })

    const componentName = await vscode.window.showInputBox({
      prompt: 'Enter the component name',
      placeHolder: 'e.g., Button',
    })

    if (ext !== '' && styleType !== '') {
      console.log(ext, styleType)
    } else {
      ext = await vscode.window.showQuickPick(['js', 'jsx', 'tsx'], {
        placeHolder: 'Select the file extension for the component',
      })

      styleType = await vscode.window.showQuickPick(
        ['css', 'scss', 'tailwind'],
        {
          placeHolder: 'Select the style type for the component',
        }
      )

      setPreferencesCommand(ext as string, styleType as string)
    }

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

export default generateComponentStructure
