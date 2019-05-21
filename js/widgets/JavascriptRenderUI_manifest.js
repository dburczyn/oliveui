(function ($, OliveUI, newCodeEditorUI) {
  'use strict';

  OliveUI.addWidgetManifest({

    name: 'Javascript Render UI',
    description: '',

    createUIFn: function () {
      var _newJavascriptRenderUI = function (config = {}) {
        var _dom = {
          rootDiv: $('<div>')
        };
        return {
          render: function () {
            return _dom.rootDiv;
          },
          setContent: function (content = {}) {
            content.javascriptAlg = content.javascriptAlg || 'return "";';
            _dom.rootDiv.empty();
            try {
              var algF = new Function(content.javascriptAlg + '\n//# sourceURL=' + OliveUI.utils.generateUUID() + '.js');
              var domOut = algF();
              _dom.rootDiv.append(domOut);
            } catch (e) {
              OliveUI.utils.showError(e, _dom.rootDiv);
            }
          }
        };
      };
      return _newJavascriptRenderUI();
    },

    createConfigurationUIFn: function () {
      var _newJavascriptRenderUI_configUI = function () {
        var codeEditor = newCodeEditorUI({});
        return {
          getContent: function () {
            return {
              javascriptAlg: codeEditor.getContent().text
            };
          },
          setContent: function (content = {}) {
            codeEditor.setContent({
              text: content.javascriptAlg || '//Javascript algoritm that "return" a DOM object.\n'
            });
          },
          render: codeEditor.render,
          refresh: codeEditor.refresh
        };
      };
      return _newJavascriptRenderUI_configUI();
    }

    /* OR
    createConfigurationUIFn: function () {
      return newCodeEditorUI({});
    },
    configurationMappingFn: function (widget, configurationUIOutputConfig, viewUIInputConfig) {
      Object.assign(viewUIInputConfig, {
        javascriptAlg: configurationUIOutputConfig.text
      });
    }
    */
  });

}(jQuery, OliveUI, OliveUI.modules.newCodeEditorUI));
