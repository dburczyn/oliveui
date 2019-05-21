(function ($, OliveUI, showdown, newCodeEditorUI) {
  'use strict';

  OliveUI.addWidgetManifest({

    name: 'Markdown Render UI',
    description: '',

    createUIFn: function () {
      var _newMarkdownRenderUI = function (config = {}) {
        config.noHeaderId = config.noHeaderId!=null ? config.noHeaderId: true;
        var _dom = {
          rootDiv: $('<div>')
        };
        var _converter = new showdown.Converter(config);
        return {
          render: function () {
            return _dom.rootDiv;
          },
          setContent: function (content = {}) {
            content.text = content.text || '';
            _dom.rootDiv.empty();
            try {
              var html = _converter.makeHtml(content.text);
              _dom.rootDiv.append($(html));
            } catch (e) {
              OliveUI.utils.showError(e, _dom.rootDiv);
            }
          }
        };
      };
      return _newMarkdownRenderUI();
    },

    createConfigurationUIFn: function () {
      return newCodeEditorUI({
        mode: 'markdown'
      });
    }

  });

}(jQuery, OliveUI, showdown, OliveUI.modules.newCodeEditorUI));
