(function ($, OliveUI,  newHTMLEditorUI) {
    'use strict';
  OliveUI.addWidgetManifest({
    name: 'HTML Render UI',
    description: '',
    createUIFn: function () {
      var _newHTMLRenderUI = function (config = {}) {
        var _dom = {
          rootDiv: $('<div>')
        };
        return {
          render: function () {
            return _dom.rootDiv;
          },
          setContent: function (content = {}) {
            content.html = content.html || '';
            _dom.rootDiv.empty();
            try {
              _dom.rootDiv.append($(content.html));
            } catch (e) {
              OliveUI.utils.showError(e, _dom.rootDiv);
            }
          }
        };
      };
      return _newHTMLRenderUI();
    },
    createConfigurationUIFn: function () {
      return newHTMLEditorUI({});
    }
  });
}(jQuery, OliveUI, OliveUI.modules.newHTMLEditorUI));
