import * as vscode from "vscode";
import * as fs from "fs";
//import { generalComment } from "./generalComment";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "typestest" is now active!');

  let disposable = vscode.workspace.onDidChangeTextDocument(() => {
    let editor = vscode.window.activeTextEditor;

    if (editor) {
      const position = editor.selection.active;
      var newPosition;
      var newSelection;
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0");
      var yyyy = today.getFullYear();
      //getting the active line
      const activeLine: vscode.TextLine = editor.document.lineAt(
        editor.selection.active.line
      );

      const activeChar: string = activeLine.text.charAt(
        editor.selection.active.character
      );

      //full filePath
      var filePath: string = editor.document.fileName;
      var elements = filePath.split("\\");
      //file Name (test.h)
      var fName: string = elements[elements.length - 1];

      try {
        const nextLine = editor.document.lineAt(
          editor.selection.active.line + 1
        );

        if (
          fName.endsWith(".c") ||
          fName.endsWith(".cpp") ||
          fName.endsWith(".h")
        ) {
          if (
            nextLine.text.includes("(") &&
            nextLine.text.includes(")") &&
            (!(activeChar === "") && activeLine.text.trim().startsWith("/**"))
          ) {
            var str: string = nextLine.text.trim();
            var returnType = str.split(" ")[0];
            str = str.slice(str.indexOf("(") + 1, str.indexOf(")"));
            var param = str.split(",");
            var c: string = "\n    /**\n    *@brief \n    *";

            for (var i = 0; i < param.length; i++) {
              c = c + "@param" + " " + param[i].trim() + "\n    " + "*";
            }

            if (
              !nextLine.text
                .trim()
                .startsWith(fName.slice(0, fName.indexOf(".")))
            ) {
              c = c + "@return" + " " + returnType + "\n    " + "**/";
            } else {
              c = c + "\n    " + "**/";
            }
            /*void c1::m1(){} */
            editor.edit(editBuilder => {
              editBuilder.replace(activeLine.range, c);
            });
            if (
              //nextLine !== constructor
              !nextLine.text
                .trim()
                .startsWith(fName.slice(0, fName.indexOf(".")))
            ) {
              c =
                c.substring(2) +
                "\n" +
                nextLine.text.trim().split(" ")[0] +
                " " +
                fName.slice(0, fName.indexOf(".")) +
                "::" +
                nextLine.text
                  .trim()
                  .slice(
                    nextLine.text.trim().indexOf(" ") + 1,
                    nextLine.text.trim().indexOf(";")
                  ) +
                " {\n}\n\n";
            } else {
              //nextLine ===constructor
              c =
                c.substring(2) +
                "\n" +
                fName.slice(0, fName.indexOf(".")) +
                "::" +
                nextLine.text
                  .trim()
                  .slice(0, nextLine.text.trim().indexOf(";")) +
                " {\n}\n\n";
            }

            /*var setting: vscode.Uri = vscode.Uri.parse(
              "untitled:" +
                filePath.slice(0, filePath.lastIndexOf(".")) +
                ".cpp"
            );
            vscode.workspace.openTextDocument(setting).then(
              (a: vscode.TextDocument) => {
                vscode.window.showTextDocument(a, 1, false).then(e => {
                  e.edit(edit => {
                    edit.insert(new vscode.Position(0, 0), c);
                  });
                });
              },
              (error: any) => {
                console.error(error);
                debugger;
              }
            );*/
            let newPath = filePath.slice(0, filePath.lastIndexOf(".")) + ".cpp";
            fs.readFile(newPath, function(err, data) {
              if (err) {
                fs.writeFile(
                  newPath,
                  "class" +
                    " " +
                    fName.slice(0, fName.indexOf(".")) +
                    "{\n" +
                    c +
                    "\t};",
                  "utf8",
                  function(err) {
                    if (err) {
                      return console.log(err);
                    }
                  }
                );
              } else {
                let result =
                  data.toString().slice(0, data.toString().lastIndexOf("}")) +
                  c +
                  "};";
                fs.writeFile(newPath, result, "utf8", function(err) {
                  if (err) {
                    return console.log(err);
                  }
                });
              }
            });
          }
        }
      } catch (error) {
        if (!(activeChar === "") && activeLine.text.startsWith("/**")) {
          if (
            fName.endsWith(".c") ||
            fName.endsWith(".cpp") ||
            fName.endsWith(".h")
          ) {
            editor.edit(editBuilder => {
              editBuilder.replace(
                activeLine.range,
                "/**\n* @file " +
                  fName +
                  "\n" +
                  "* @author your name (you@domain.com)\n" +
                  "* @brief \n" +
                  "* @version 0.1\n" +
                  "* @date " +
                  mm +
                  "/" +
                  dd +
                  "/" +
                  yyyy +
                  "\n*\n* @copyright Copyright (c) " +
                  yyyy +
                  "\n*\n*/"
              );
            });
            newPosition = position.with(position.line + 3, 9);
            newSelection = new vscode.Selection(newPosition, newPosition);
            editor.selection = newSelection;
            vscode.window.showInformationMessage(
              fName.substring(fName.indexOf("."))
            );
          } else {
            vscode.window.showInformationMessage(
              'only files ".c" and ".cpp" supported'
            );
          }
        }
      }
    } else {
      vscode.window.showInformationMessage("generated successfully!");
    }
  });

  /*
  let editor = vscode.window.activeTextEditor;
  const activeLine: vscode.TextLine = editor.document.lineAt(
    editor.selection.active.line
  ); 
  if (activeLine.text.trim().startsWith("for")) {

  }
  let format = vscode.workspace.onDidSaveTextDocument(e => {
    let fstring: string = "";
    console.log(e.getText());
  });*/

  context.subscriptions.push(disposable);
  /*context.subscriptions.push(format);*/
}

// this method is called when your extension is deactivated
export function deactivate() {}
