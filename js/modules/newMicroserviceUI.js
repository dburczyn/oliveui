(function ($, OliveUI, Utils) {
  'use strict';

  var _statics = {
    services: {
      callMicroserviceForced: function (restEndpoint, microserviceId, operationId, inputs, successCallback, failureCallback) {
        Utils.callService(restEndpoint + 'msc/callMicroserviceForced', 'microserviceId=' + microserviceId + '&operationId=' + operationId, JSON.stringify(inputs), successCallback, failureCallback);
      }
    },
    init: {
      checkConfig: function (config) {
        config.mscEndpoint = config.mscEndpoint || '';
      },
      loadContent: function (_dom, msConfig, mscEndpoint) {
        _dom.outputDiv.empty().addClass('loading');

        _statics.services.callMicroserviceForced(mscEndpoint, msConfig.microserviceId, msConfig.operationId, JSON.parse(msConfig.microserviceInputJSON), function (data) {
          _dom.outputDiv.removeClass('loading');

          var alg = msConfig.microserviceOutputAdaptAlg;
          if (alg.indexOf('return ') === -1) {
            alg = 'return $("<pre>").append($("<code>").append(JSON.stringify(output, null, 2)));';
          }
          try {
            var algF = new Function('output', alg + '\n//# sourceURL=' + Utils.generateUUID() + '.js');
            var domOut = algF(data);
            _dom.outputDiv.empty().append(domOut);
          } catch (e) {
            Utils.showError(e, _dom.messageDiv);
          }

        }, function (error) {
          _dom.outputDiv.removeClass('loading');
          Utils.showError(error, _dom.messageDiv);
        });
      }
    },
    ui: {
      newDom: function () {
        var _dom = {
          messageDiv: $('<div>'),
          outputDiv: $('<div>')
        };
        return _dom;
      },
      render: function (_dom) {
        return $('<div>').prepend(
          `<style>
            .loading {
              width: 100%;
              height: 100%;
              background: rgba(0,0,0,.05) url(https://damianofalcioni.github.io/CDN/icons/loading.gif) center center no-repeat;
            }
            </style>`
        ).append(
          _dom.messageDiv,
          _dom.outputDiv);
      },
      setContent: function (_dom, config, content) {
        content.microserviceId = content.microserviceId || '';
        content.operationId = content.operationId || '';
        content.microserviceInputJSON = content.microserviceInputJSON || '{}';
        content.microserviceOutputAdaptAlg = content.microserviceOutputAdaptAlg || '';

        _statics.init.loadContent(_dom, content, config.mscEndpoint);
      }
    }
  };

  var _newMicroserviceUI = function (config = {}) {
    _statics.init.checkConfig(config);

    var _dom = _statics.ui.newDom();

    return {
      render: function () {
        return _statics.ui.render(_dom);
      },
      setContent: function (content = {}) {
        return _statics.ui.setContent(_dom, config, content);
      }
    };
  };

  OliveUI.modules.newMicroserviceUI = _newMicroserviceUI;

}(jQuery, OliveUI, OliveUI.utils));
