import * as vscode from 'vscode'
import { extensioName } from './constant'

const setPreferencesCommand = async (ext?: string, styleType?: string) => {
  const config = vscode.workspace.getConfiguration(extensioName)

  if (ext !== undefined) {
    await config.update('ext', ext, vscode.ConfigurationTarget.Workspace)
  }

  if (styleType !== undefined) {
    await config.update(
      'styleType',
      styleType,
      vscode.ConfigurationTarget.Workspace
    )
  }

  vscode.window.showInformationMessage('Preferences saved for the workspace.')
}

export default setPreferencesCommand
