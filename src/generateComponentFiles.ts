import * as vscode from 'vscode'
const fs = require('fs')
const path = require('path')

import setPreferencesCommand from './preferences'
import { extensioName } from './constant'
import { getExportSnippet, getSnippet, getStyleSnippet } from './snippets'

const generateComponentFiles = vscode.commands.registerCommand(
  `${extensioName}.generateComponentFiles`,
  async uri => {
    let workspacePath
    let relativePath = ''

    if (
      vscode.workspace.workspaceFolders &&
      vscode.workspace.workspaceFolders.length > 0
    ) {
      workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath

      if (uri) {
        // Check if the URI represents a folder
        if (uri.scheme === 'file' && uri.fsPath) {
          // Get the path of the folder
          const folderPath = uri.fsPath

          relativePath = path.relative(workspacePath, folderPath)
        }
      }
    } else {
      vscode.window.showErrorMessage('No workspace is open.')
    }

    const config = await vscode.workspace.getConfiguration(extensioName)
    // Retrieve "ext" and "styleType" from the workspace configuration
    let ext = await config.get('ext')
    let styleType = await config.get('styleType')

    const componentPath = await vscode.window.showInputBox({
      prompt: 'Enter the path for the component',
      placeHolder: 'e.g., src/components',
      value: relativePath,
    })

    if (typeof componentPath === 'undefined') return

    if (componentPath === '') {
      vscode.window.showErrorMessage('No path entered.')
      return
    }

    const componentFullPath = path.join(workspacePath, componentPath)

    let folderName = await vscode.window.showInputBox({
      prompt: 'Enter the folder name for the component',
      placeHolder: 'e.g., button',
    })

    if (typeof folderName === 'undefined') return
    if (folderName === '') folderName = 'button'

    let componentName = (await vscode.window.showInputBox({
      prompt: 'Enter the component name',
      placeHolder: 'e.g., Button',
    })) as string

    if (typeof componentName === 'undefined') return
    if (componentName === '') componentName = 'Button'

    if (ext === '' || styleType === '') {
      if (ext === '') {
        ext = await vscode.window.showQuickPick(['js', 'jsx', 'tsx'], {
          placeHolder: 'Select the file extension for the component',
        })
      }

      if (styleType === '') {
        styleType = await vscode.window.showQuickPick(
          ['css', 'scss', 'tailwind'],
          {
            placeHolder: 'Select the style type for the component',
          }
        )
      }

      if (typeof ext === 'undefined' || typeof styleType === 'undefined') return
      if (ext === '') ext = 'js'
      if (styleType === '') styleType = 'css'

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

        if (styleType === '') styleType = 'css'
        if (ext === '') ext = 'js'

        // Create ComponentName.tsx
        const componentPath = path.join(folderPath, `${componentName}.${ext}`)
        fs.writeFileSync(
          componentPath,
          await getSnippet(componentName, styleType as string)
        )

        // Create index.tsx
        const indexPath = path.join(folderPath, `index.${ext}`)
        fs.writeFileSync(indexPath, await getExportSnippet(componentName))

        // Create style file based on styleType
        switch (styleType) {
          case 'css':
            const cssPath = path.join(folderPath, `${componentName}.css`)
            fs.writeFileSync(
              cssPath,
              await getStyleSnippet(componentName, styleType)
            )
            break
          case 'scss':
            const scssPath = path.join(
              folderPath,
              `${componentName}.module.scss`
            )
            fs.writeFileSync(
              scssPath,
              await getStyleSnippet(componentName, styleType)
            )
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

export default generateComponentFiles
