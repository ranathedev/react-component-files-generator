import * as vscode from 'vscode'

const setPreferencesCommand = async (ext?: string, styleType?: string) => {
  const config = vscode.workspace.getConfiguration('generate-react-component')

  if (ext !== undefined) {
    // Save "ext" to the workspace configuration
    await config.update('ext', ext, vscode.ConfigurationTarget.Workspace)
  }

  if (styleType !== undefined) {
    // Save "styleType" to the workspace configuration
    await config.update(
      'styleType',
      styleType,
      vscode.ConfigurationTarget.Workspace
    )
  }

  vscode.window.showInformationMessage('Preferences saved for the workspace.')
}

export default setPreferencesCommand
