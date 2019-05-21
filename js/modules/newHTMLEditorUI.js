(function ($, OliveUI, CodeMirror) {
  'use strict';
  if (!$('<div>').summernote) throw 'Summernote WYSIWYG Editor not available';

  OliveUI.modules.newHTMLEditorUI = function (config = {}) {
    config.height = config.minHeight || 100;
    config.codemirror = config.codemirror || {
      mode: 'htmlmixed',
      tabSize: 2,
      lineNumbers: true,
      lineWrapping: true
    };

    var _dom = {
      rootDiv: $('<div>'),
      editorDiv: $('<div>')
    };
    _dom.rootDiv.append(_dom.editorDiv);
    _dom.editorDiv.summernote(config);

    return {
      render: function () {
        return _dom.rootDiv;
      },
      setContent: function (content = {}) {
        _dom.editorDiv.summernote('code', content.html || '');
      },
      getContent: function () {
        return {
          html: _dom.editorDiv.summernote('code')
        };
      }
    };
  };
}(jQuery, OliveUI, CodeMirror));
