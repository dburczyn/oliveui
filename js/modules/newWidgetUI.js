(function ($, OliveUI, Utils) {
  'use strict';

  var _statics = {
    ui: {
      render: function (_dom) {
        if (!Utils.isStyled('panel-title')) throw 'Bootstrap css Required';

        return _dom.panelRoot.append(
          `<style>
            .link{
              cursor: pointer;
              color: #428bca;
              white-space: nowrap;
            }
            .link:hover{
              color: #FFFFFF;
              background-color: #428bca;
            }
          </style>`
        ).append(
          _dom.panelHeader.append(
            $('<h4 class="panel-title">').append(
              _dom.panelTitle,
              ' <span class="caret"></span>',
              $('<div class="btn-group pull-right">').append(
                _dom.refeshBtn,
                _dom.settingBtn,
                _dom.deleteBtn))),
          _dom.panelCollapsable.append(
            $('<div class="panel-body">').append(
              _dom.messageDiv,
              _dom.rootDiv.append(
                _dom.renderModuleDom,
                _dom.configModuleDom))));
      },
      setContent: function (_dom, _state, config, content) {
        _state.content = content;
        _state.contentInitialized = true;
        _statics.widget.refreshCurrentView(_dom, config, _state);
      },
      getContent: function (_state, config) {
        return config.configModule ? config.configModule.getContent() : (_state.content);
      }
    },
    init: {
      initButtonsVisibility: function (_dom, config) {
        _dom.refeshBtn.toggle(config.refreshBtnVisible);
        _dom.settingBtn.toggle(config.configModule ? config.settingBtnVisible : false);
        _dom.deleteBtn.toggle(config.removeBtnClickFn ? config.deleteBtnVisible : false);
      },
      initWidget: function (_dom, config, _state) {
        _dom.panelTitle.html(config.widgetTitle);
        _statics.init.initButtonsVisibility(_dom, config);
        _dom.renderModuleDom.hide();
        _dom.configModuleDom.hide();

        if (_state.currentView == 'config')
          _statics.widget.showConfigView(_dom, config, _state);
        else {
          if (_state.contentInitialized)
            _statics.widget.showRenderView(_dom, config, _state);
        }
      }
    },
    widget: {
      showRenderView: function (_dom, config, _state) {
        _state.currentView = 'render';
        _dom.renderModuleDom.show();
        _dom.configModuleDom.hide();

        try {
          var renderModuleContent = {};
          config.mappingFn(_state.content, renderModuleContent);
          config.renderModule.setContent(renderModuleContent);
        } catch (error) {
          Utils.showError(error, _dom.messageDiv);
        }
      },
      showConfigView: function (_dom, config, _state) {
        if (!config.configModule) return;
        _state.currentView = 'config';
        _dom.renderModuleDom.hide();
        _dom.configModuleDom.show();
        try {
          config.configModule.setContent(_state.content);
        } catch (error) {
          Utils.showError(error, _dom.messageDiv);
        }
      },
      refreshCurrentView: function (_dom, config, _state) {
        if (_state.currentView == 'config')
          _statics.widget.showConfigView(_dom, config, _state);
        else
          _statics.widget.showRenderView(_dom, config, _state);
      }
    }
  };

  var _newWidgetUI = function (config = {}) {
    config.initialView = config.initialView || 'render'; //render or config
    config.widgetTitle = config.widgetTitle || '';
    config.removeBtnClickFn = config.removeBtnClickFn || null;
    config.refreshBtnVisible = config.refreshBtnVisible != null ? config.refreshBtnVisible : true;
    config.settingBtnVisible = config.settingBtnVisible != null ? config.settingBtnVisible : true;
    config.deleteBtnVisible = config.deleteBtnVisible != null ? config.deleteBtnVisible : true;
    config.mappingFn = config.mappingFn || function (configOutput, renderInput) {
      Object.assign(renderInput, configOutput);
    };
    if (!config.renderModule) throw 'renderModule not provided';
    config.configModule = config.configModule || null;
    if (!config.renderModule.render) throw 'render function required for the renderModule';
    if (!config.renderModule.setContent) throw 'setContent function required for the renderModule';
    if (config.configModule && !config.configModule.render) throw 'render function required for the configModule';
    if (config.configModule && !config.configModule.setContent) throw 'setContent function required for the configModule';
    if (config.configModule && !config.configModule.getContent) throw 'getContent function required for the configModule';

    var _state = {
      content: {},
      contentInitialized: false,
      currentView: config.initialView
    };

    var _dom = {
      rootDiv: $('<div>'),
      panelHeader: $('<div class="panel-heading clearfix link">').click(function () {
        _dom.panelCollapsable.collapse('toggle');
      }),
      panelRoot: $('<div class="panel panel-default">'),
      panelTitle: $('<span>'),
      panelCollapsable: $('<div class="panel-collapse">').on('shown.bs.collapse', function () {
        _statics.widget.refreshCurrentView(_dom, config, _state);
      }),
      messageDiv: $('<div>'),
      refeshBtn: $('<button title="Refresh" class="btn btn-default btn-xs">Refresh</button>').click(function (e) {
        e.stopPropagation();
        _statics.widget.showRenderView(_dom, config, _state);
      }),
      settingBtn: $('<button title="Configure" class="btn btn-default btn-xs">Configure</button>').click(function (e) {
        e.stopPropagation();
        _statics.widget.showConfigView(_dom, config, _state);
      }),
      deleteBtn: $('<button title="Remove" class="btn btn-default btn-xs">Remove</button>').click(function (e) {
        e.stopPropagation();
        if (config.removeBtnClickFn) config.removeBtnClickFn();
      }),
      renderModuleDom: $('<div>').append(config.renderModule.render()),
      configModuleDom: $('<div>').append(config.configModule ? config.configModule.render().append(
        '<br><br>',
        $('<button title="Save" class="btn btn-primary">Save</button>').click(function (e) {
          e.stopPropagation();
          e.preventDefault();
          _state.content = config.configModule.getContent();
          _statics.widget.showRenderView(_dom, config, _state);
        })) : null)
    };

    _statics.init.initWidget(_dom, config, _state);

    return {
      render: function () {
        return _statics.ui.render(_dom);
      },
      setContent: function (content = {}) {
        _statics.ui.setContent(_dom, _state, config, content);
      },
      getContent: function () {
        return _statics.ui.getContent(_state, config);
      },
      setWidgetTitle: function (title = '') {
        _dom.panelTitle.html(title);
      },
      setWidgetId: function (id = '') {
        _dom.panelRoot.attr('id', id);
      },
      getConfig: function () {
        return config;
      }
    };
  };

  OliveUI.modules.newWidgetUI = _newWidgetUI;

}(jQuery, OliveUI, OliveUI.utils));
