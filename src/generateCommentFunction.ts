/*function that create comments for methods */
import * as vscode from "vscode";
export function generarteCommentFunction() {
  let editor = vscode.window.activeTextEditor;
  if (editor) {
    const activeLine: vscode.TextLine = editor.document.lineAt(
      editor.selection.active.line
    );
  }
}
