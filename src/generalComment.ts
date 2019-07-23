/*function that generates a comment if the file is empty */
import * as vscode from "vscode";

export function generalComment() {
  let editor = vscode.window.activeTextEditor;
  if (editor) {
    const activeLine: vscode.TextLine = editor.document.lineAt(
      editor.selection.active.line
    );
  }
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
}
