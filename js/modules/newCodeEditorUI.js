(function ($, OliveUI, CodeMirror) {
  'use strict';
  OliveUI.modules.newCodeEditorUI = function (config = {}) {
    config.mode = config.mode || 'javascript';
    config.tabSize = config.tabSize || 2;
    config.lineNumbers = config.lineNumbers != null ? config.lineNumbers : true;
    config.lineWrapping = config.lineWrapping != null ? config.lineWrapping : true;

    var _dom = {
      rootDiv: $('<div>'),
    };
    var _state = {
      editor: CodeMirror(_dom.rootDiv[0], config)
    };

    return {
      render: function () {
        return _dom.rootDiv.prepend(`<style>
            .CodeMirror {
              height: auto !important;
              border: 1px solid #ddd !important;
            }
            .CodeMirror-scroll {
              max-height: 200px !important;
              min-height: 100px !important;
            }
          </style>`);
      },
      refresh: function () {
        _state.editor.refresh();
      },
      setContent: function (content = {}) {
        content.text = content.text || '';
        _state.editor.setValue(content.text);
        _state.editor.refresh();
      },
      getContent: function () {
        return {
          text: _state.editor.getValue()
        };
      }
    };
  };
}(jQuery, OliveUI, CodeMirror));
