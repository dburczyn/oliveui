(function ($, OliveUI, new_brokerage_object_grid_widget, new_brokerage_object_grid_config_js) {
  'use strict';
  OliveUI.addWidgetManifest({
    name: 'Grid Widget',
    description: '',
    createUIFn: function () {
      var _newbrokeragegrid = function (config = {}) {
        var _dom = {
          rootDiv: $('<div>')
        };
        return {
          render: function () {
            return _dom.rootDiv;
          },
          setContent: function (content = {}) {
            content = content || '';
            _dom.rootDiv.empty();
            try {
              _dom.rootDiv.append(OliveUI.modules.new_brokerage_object_grid_widget_js().render(content));
            } catch (e) {
              OliveUI.utils.showError(e, _dom.rootDiv);
            }
          }
        };
      };
      return _newbrokeragegrid();
    },
    createConfigurationUIFn: function () {
      return new_brokerage_object_grid_config_js({
      });
    },
  });
}(jQuery, OliveUI, OliveUI.modules.new_brokerage_object_grid_widget, OliveUI.modules.new_brokerage_object_grid_config_js));
