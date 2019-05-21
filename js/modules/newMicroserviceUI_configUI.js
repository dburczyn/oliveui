(function ($, OliveUI, Utils, newCodeEditorUI) {
  'use strict';

  /* newMSInputTableUI will be hided from outside */
  var newMSInputTableUI = (function (Utils) {
    var _statics = {
      services: {
        getMicroserviceIOInfo: function (restEndpoint, microserviceId, operationId, successCallback, failureCallback) {
          Utils.callService(restEndpoint + 'msc/getMicroserviceIOInfo', 'microserviceId=' + microserviceId + '&operationId=' + operationId, null, successCallback, failureCallback);
        }
      },
      init: {
        initInputTable: function (_dom, _state, config) {
          if (typeof $.fn.popover != 'function') throw 'Bootstrap popover Required';

          _statics.services.getMicroserviceIOInfo(config.mscEndpoint, config.microserviceId, config.operationId, function (msIOInfo) {
            _state.loadCompleted = false;
            _dom.tableTbody.empty();
            Object.keys(msIOInfo.requiredInputTemplate).forEach(function (inputId) {
              var inputInfos = msIOInfo.requiredInputTemplate[inputId];
              _dom.inputTxts[inputId] = $('<textarea style="resize:vertical;" rows="1" class="form-control" placeholder="' + inputInfos.workingExample + '">' + inputInfos.workingExample + '</textarea>');

              _dom.tableTbody.append(
                $('<tr>').append(
                  $('<td>').append(
                    $('<div class="input-group">').append(
                      $('<span class="input-group-addon">' + inputId + '</span>').popover({
                        placement: 'auto left',
                        container: 'body',
                        html: true,
                        title: inputId + ' details',
                        content: inputInfos.description,
                        trigger: 'hover click'
                      }),
                      _dom.inputTxts[inputId]))));
            });
            _state.loadCompleted = true;
            _statics.ui.setContent(_dom, _state, _state.content);
            config.outputDescriptionHandlerFn(msIOInfo.outputDescription);
          }, function (error) {
            Utils.showError(error, _dom.messageDiv);
          });
        }
      },
      ui: {
        newDom: function () {
          return {
            inputTxts: {},
            tableTbody: $('<tbody>'),
            messageDiv: $('<div>')
          };
        },
        render: function (_dom) {
          if (!Utils.isStyled('input-group')) throw 'Bootstrap css Required';

          return $('<div>').append(
            $('<table class="table table-condensed table-hover">').append(
              _dom.tableTbody),
            _dom.messageDiv);
        },
        setContent: function (_dom, _state, content) {
          if (_state.loadCompleted) {
            Object.keys(content).forEach(function (inputId) {
              if (_dom.inputTxts[inputId] == null) throw 'Impossible to find the input ' + inputId;
              _dom.inputTxts[inputId].val(content[inputId].value ? content[inputId].value : '');
            });
          }
        },
        getContent: function (_dom, _state) {
          if (_state.loadCompleted) {
            var ret = {};
            Object.keys(_dom.inputTxts).forEach(function (inputId) {
              ret[inputId] = {
                value: _dom.inputTxts[inputId].val()
              };
            });
            return ret;
          } else {
            return _state.content;
          }
        }
      }
    };

    return function (config = {}) {
      config.mscEndpoint = config.mscEndpoint || '';
      config.microserviceId = config.microserviceId || '';
      config.operationId = config.operationId || '';
      config.outputDescriptionHandlerFn = config.outputDescriptionHandlerFn || function (desc) {};

      var _state = {
        content: {},
        loadCompleted: false
      };
      var _dom = _statics.ui.newDom();

      _statics.init.initInputTable(_dom, _state, config);

      return {
        render: function () {
          return _statics.ui.render(_dom);
        },
        getContent: function () {
          return _statics.ui.getContent(_dom, _state);
        },
        setContent: function (content = {}) {
          _state.content = content;
          _statics.ui.setContent(_dom, _state, content);
        }
      };
    };
  }(Utils));

  var _statics = {
    services: {
      callMicroserviceForced: function (restEndpoint, microserviceId, operationId, inputs, successCallback, failureCallback) {
        Utils.callService(restEndpoint + 'msc/callMicroserviceForced', 'microserviceId=' + microserviceId + '&operationId=' + operationId, JSON.stringify(inputs), successCallback, failureCallback);
      },
      callMicroservice: function (restEndpoint, microserviceId, operationId, inputs, successCallback, failureCallback) {
        Utils.callService(restEndpoint + 'msc/callMicroservice', 'microserviceId=' + microserviceId + '&operationId=' + operationId, JSON.stringify(inputs), successCallback, failureCallback);
      }
    },
    view: {
      showMSResult: function (output, _sub, _dom) {
        var adaptationAlg = _sub.codeEditor.getContent().text;

        _dom.resultTxt.val(JSON.stringify(output, null, 4));
        if (adaptationAlg.indexOf('return ') === -1) {
          adaptationAlg = 'return $("<pre>").append($("<code>").append(JSON.stringify(output, null, 2)));';
        }
        try {
          var algF = new Function('output', adaptationAlg + '\n//# sourceURL=microservice_custom_alg.js');
          var domDemoRes = algF(output);
          _dom.resultDemoDiv.empty().append(domDemoRes);
        } catch (e) {
          Utils.showError(e, _dom.rootNode);
        }
      },
      callMicroservice: function (_dom, _sub, config) {
        var requiredInputs = _sub.inputTable.getContent();
        _dom.callInputJsonPre.html(JSON.stringify(requiredInputs, null, 4));
        if (config.forceStartWhenStopped) {
          _statics.services.callMicroserviceForced(config.mscEndpoint, config.microserviceId, config.operationId, requiredInputs, function (output) {
            _statics.view.showMSResult(output, _sub, _dom);
          }, function (error) {
            Utils.showError(error, _dom.rootNode);
          });
        } else {
          _statics.services.callMicroservice(config.mscEndpoint, config.microserviceId, config.operationId, requiredInputs, function (output) {
            _statics.view.showMSResult(output, _sub, _dom);
          }, function (error) {
            Utils.showError(error, _dom.rootNode);
          });
        }
      }
    },
    init: {
      initEndpointText: function (_dom, config) {
        _dom.callEndpointSpan.text(config.mscEndpoint + 'msc/callMicroserviceForced?microserviceId=' + config.microserviceId + '&operationId=' + config.operationId);
        _dom.callMicroserviceIdSpan.text(config.microserviceId);
        _dom.callMicroserviceOperationIdSpan.text(config.operationId);
        _dom.callInputJsonPre.html('');
      }
    },
    ui: {
      render: function (_dom, _sub, config) {
        if (!Utils.isStyled('input-group')) throw 'Bootstrap css Required';

        return _dom.rootNode.empty().append(
          _dom.messageDiv,
          $('<div>').toggle(config.showServiceNameTxt).append(
            $('<div class="input-group">').append(
              '<span class="input-group-addon">Name to visualize: </span>',
              _dom.serviceNameTxt)),
          '<br>',
          $('<div class="container-fluid">').append(
            $('<div class="row">').append(
              $('<div class="col-md-6">').append(
                '<b>Microservice Required Inputs</b>',
                _sub.inputTable.render()),
              $('<div class="col-md-6">').append(
                '<b>Custom Rendering Algorithm</b>',
                _sub.codeEditor.render()))),
          _dom.testCallBtn,
          '<br><br>',
          $('<div class="row">').append(
            $('<div class="col-md-6">').append(
              $('<div class="well">').append(
                '<b>Miscroservice ID: </b>',
                _dom.callMicroserviceIdSpan,
                '<br><b>Microservice Operation: </b>',
                _dom.callMicroserviceOperationIdSpan,
                '<br><br><b>POST Endpoint</b><br>',
                _dom.callEndpointSpan,
                '<br><b>POST Input Data</b><br>',
                _dom.callInputJsonPre,
                '<br><b>Output description:</b> ',
                _dom.resultDescriptionSpan,
                '<br><b>Output</b><br>',
                _dom.resultTxt)),
            $('<div class="col-md-6">').append(
              $('<div class="panel panel-default">').append(
                $('<div class="panel-heading">').append(
                  $('<h4 class="panel-title">Service Output Post-Rendering Preview</h4>')),
                $('<div class="panel-body">').append(
                  _dom.resultDemoDiv)))));
      },
      getContent: function (_dom, _sub, _state) {
        return {
          microserviceInputs: _sub.inputTable.getContent(),
          serviceName: _dom.serviceNameTxt.val(),
          microserviceOutputAdaptAlg: _sub.codeEditor.getContent().text
        };
      },
      setContent: function (_dom, _sub, content) {
        _dom.serviceNameTxt.val(content.serviceName || '');
        _sub.inputTable.setContent(content.microserviceInputs || {});
        _sub.codeEditor.setContent({
          text: content.microserviceOutputAdaptAlg || '/*\n  Javascript algoritm that "return" a DOM object.\n  The algorithm can access the microservice output content\n  using the variable "output"\n*/'
        });
      }
    }
  };

  var _newMicroserviceUI_configUI = function (config = {}) {
    config.mscEndpoint = config.mscEndpoint || '';
    config.microserviceId = config.microserviceId || '';
    config.operationId = config.operationId || '';
    config.forceStartWhenStopped = config.forceStartWhenStopped != null ? config.forceStartWhenStopped : true;
    config.showServiceNameTxt = config.showServiceNameTxt != null ? config.showServiceNameTxt : true;

    var _dom = {
      rootNode: $('<div>'),
      messageDiv: $('<div>'),
      serviceNameTxt: $('<input type="text" class="form-control" placeholder="Unique Name">'),
      resultTxt: $('<textarea style="resize:vertical;" rows="10" class="form-control" placeholder="Call results"></textarea>'),
      resultDescriptionSpan: $('<span>'),
      resultDemoDiv: $('<div>'),
      callMicroserviceIdSpan: $('<span>'),
      callMicroserviceOperationIdSpan: $('<span>'),
      callEndpointSpan: $('<span>'),
      callInputJsonPre: $('<pre>'),
      testCallBtn: null
    };

    var _sub = {
      codeEditor: newCodeEditorUI({}),
      inputTable: newMSInputTableUI({
        mscEndpoint: config.mscEndpoint,
        microserviceId: config.microserviceId,
        operationId: config.operationId,
        outputDescriptionHandlerFn: function (desc) {
          _dom.resultDescriptionSpan.text(desc);
        }
      })
    };

    _dom.testCallBtn = $('<button class="btn btn-primary" type="button">Test a Call</button>').click(function () {
      _statics.view.callMicroservice(_dom, _sub, config);
    });

    _statics.init.initEndpointText(_dom, config);

    return {
      getContent: function () {
        return _statics.ui.getContent(_dom, _sub);
      },
      setContent: function (content = {}) {
        _statics.ui.setContent(_dom, _sub, content);
      },
      render: function () {
        return _statics.ui.render(_dom, _sub, config);
      },
      afterRender: function () {
        _sub.codeEditor.refresh();
      },
      refresh: function () {
        _sub.codeEditor.refresh();
      }
    };
  };

  OliveUI.modules.newMicroserviceUI_configUI = _newMicroserviceUI_configUI;

}(jQuery, OliveUI, OliveUI.utils, OliveUI.modules.newCodeEditorUI));
