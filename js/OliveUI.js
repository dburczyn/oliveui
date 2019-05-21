(function (root, factory) {
  root.OliveUI = factory(root.jQuery);
}(typeof window !== "undefined" ? window : this, function ($) {
  'use strict';
  if (typeof $.fn.popover != 'function') throw 'Bootstrap Required';

  var _statics = {
    createWidgetInstance: function (widgetName, _dom, _state) {
      var widgetManifest = OliveUI.widgetsManifests[widgetName];
      if (!widgetManifest) throw 'Impossible to find the manifest of the widget ' + widgetName;
      if (!OliveUI.modules.newWidgetUI) throw 'Missing newWidgetUI module';
      var uuid = OliveUI.utils.generateUUID();
      var widgetRootDiv = $('<div>');
      var widget = OliveUI.modules.newWidgetUI({
        initialView: 'render',
        widgetTitle: widgetName,
        removeBtnClickFn: function () {
          widgetRootDiv.remove();
          delete _state.widgetInstances[uuid];
        },
        renderModule: widgetManifest.createUIFn(),
        configModule: widgetManifest.createConfigurationUIFn ? widgetManifest.createConfigurationUIFn() : null,
        mappingFn: widgetManifest.configurationMappingFn ? function (configOutput, renderInput) {
          widgetManifest.configurationMappingFn(widget, configOutput, renderInput);
        } : null
      });

      _dom.rootDiv.append(
        widgetRootDiv.append(
          widget.render()
        )
      );

      _state.widgetInstances[uuid] = {
        widgetName: widgetName,
        widget: widget,
        widgetRootDiv: widgetRootDiv
      };

      return uuid;
    },

    getWidgetInstanceConfiguration: function (widgetUUID, _state) {
      var widgetState = _state.widgetInstances[widgetUUID];
      if (!widgetState) throw 'Impossible to find the widget instance ' + widgetUUID;
      return widgetState.widget.getContent();
    },

    setWidgetInstanceConfiguration: function (widgetUUID, widgetContent, _state) {
      var widgetState = _state.widgetInstances[widgetUUID];
      if (!widgetState) throw 'Impossible to find the widget instance ' + widgetUUID;
      widgetState.widget.setContent(widgetContent);
    },

  };

  var OliveUI = function (config = {}) {

    var _state = {
      widgetInstances: {}
    };

    var _dom = {
      rootDiv: $('<div>')
    };

    return {
      render: function () {
        return _dom.rootDiv;
      },
      createWidgetInstance: function (widgetName) {
        return _statics.createWidgetInstance(widgetName, _dom, _state);
      },

      getWidgetInstanceConfiguration: function (widgetUUID) {
        return _statics.getWidgetInstanceConfiguration(widgetUUID, _state);
      },

      setWidgetInstanceConfiguration: function (widgetUUID, widgetContent) {
        _statics.setWidgetInstanceConfiguration(widgetUUID, widgetContent, _state);
      }
    };
  };

  OliveUI.modules = {};
  OliveUI.widgetsManifests = {};

  OliveUI.addWidgetManifest = function (widgetManifest) {
    if (!widgetManifest.name) throw 'name missing in widget manifest';
    //TODO: complete manifest check

    OliveUI.widgetsManifests[widgetManifest.name] = widgetManifest;
  };

  //------------------------------------------------------------------------
  OliveUI.utils = (function () {
    var _utils = {
      showError: function (error, parentDom) {
        console.log(error);
        $('<div class="alert alert-danger fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Error occurred:<br><pre>' + error + '</pre></div>')
          .fadeTo(5000, 500)
          .appendTo((parentDom != null) ? parentDom : $('#mainContainer'));
      },

      showSuccess: function (info, parentDom) {
        console.log(info);
        $('<div class="alert alert-success fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + info + '</div>')
          .fadeTo(5000, 500)
          .slideUp(500, function () {
            $(this).remove();
          })
          .appendTo((parentDom != null) ? parentDom : $('#mainContainer'));
      },

      getHost: function () {
        var ret = ((window.location.protocol == '') ? 'http:' : window.location.protocol) + '//' + ((window.location.hostname == '') ? '127.0.0.1' : window.location.hostname) + ((window.location.port != '') ? ':' + window.location.port : '');
        return ret;
      },

      getPageUrl: function () {
        return _utils.getHost() + window.location.pathname;
      },

      getURLParameter: function (sParam) {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
          var sParameterName = sURLVariables[i].split('=');
          if (sParameterName[0] == sParam)
            return sParameterName[1];
        }
        return null;
      },

      neverNull: function (param) {
        return param == null ? '' : param;
      },

      generateUUID: function () {
        var d = new Date().getTime();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function')
          d += performance.now(); //use high-precision timer if available

        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
      },

      callService: function (url, paramsQueryString, postData, successCallback, failureCallback) {
        var serviceUrl = url + (paramsQueryString != null ? '?' + paramsQueryString : '');
        var ajaxConfig = {
          type: 'GET',
          url: serviceUrl,
          dataType: 'json',
          async: true,
          success: function (data, status) {
            if (data.status == 0)
              successCallback(data.data);
            else
              failureCallback('Internal error: ' + data.error);
          },
          error: function (request, status, error) {
            failureCallback('Error contacting the service: ' + serviceUrl + ' : ' + status + ' ' + error);
          }
        };

        if (postData != null) {
          ajaxConfig.type = 'POST';
          ajaxConfig.processData = false;
          if (!(postData instanceof ArrayBuffer)) {
            ajaxConfig.contentType = 'application/json';
            ajaxConfig.data = postData;
          } else {
            ajaxConfig.contentType = 'application/octet-stream';
            ajaxConfig.data = postData;
          }
        }

        $.ajax(ajaxConfig);
      },

      createDialogBootstrap: function (content, title, okCallback, onSuccessCallback, onContentLoadedCallback) {
        var modalDiv = document.createElement('div');
        $(modalDiv)
          .prependTo($(document.body))
          .addClass('modal')
          .addClass('fade')
          .attr('role', 'dialog')
          .attr('tabindex', '-1')
          .append(
            $('<div class="modal-dialog" role="document">').append(
              $('<div class="modal-content">').append(
                $('<div class="modal-header">').append(
                  $('<button title="Close" type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>')).append(
                  $('<h4 class="modal-title">' + title + '</h4>'))).append(
                $('<div class="modal-body">').append(content)).append(
                $('<div class="modal-footer">').append(
                  $('<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>')).append(
                  $('<button type="button" class="btn btn-primary">Continue</button>').click(function () {
                    var ok = false;
                    if (okCallback != null && typeof okCallback === 'function')
                      ok = okCallback.call();
                    if (ok === true) {
                      $(modalDiv).modal('hide');
                      onSuccessCallback.call();
                    }
                  }))))).on('hidden.bs.modal', function () {
            modalDiv.outerHTML = '';
          }).on('shown.bs.modal', function () {
            //$(modalDiv).focus();
            onContentLoadedCallback();
          }).modal('show');
      },

      readFileAsArrayBuffer: function (file, onLoadFunction) {
        if (!file)
          return;
        if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
          alert('The File APIs are not fully supported in this browser.');
          return;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
          var content = e.target.result;
          onLoadFunction(content);
        };
        reader.readAsArrayBuffer(file);
      },

      readFileAsDataURL: function (file, onLoadFunction) {
        if (!file)
          return;
        if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
          alert('The File APIs are not fully supported in this browser.');
          return;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
          var content = e.target.result;
          onLoadFunction(content);
        };
        reader.readAsDataURL(file);
      },

      arr2obj: function (arr, idName) {
        var ret = {};
        arr.forEach(function (arrObj) {
          var key = arrObj[idName];
          delete arrObj[idName];
          ret[key] = arrObj;
        });
        return ret;
      },

      obj2arr: function (obj, idName) {
        var ret = [];
        Object.keys(obj).forEach(function (key) {
          var arrObj = obj[key];
          arrObj[idName] = key;
          ret.push(arrObj);
        });
        return ret;
      },

      clone: function (obj) {
        return JSON.parse(JSON.stringify(obj));
      },

      isStyled: function (className) {
        // var re = new RegExp('(^|,)\\s*\\.' + className + '\\s*(\\,|$)');
        // var ret = false;
        // $.each(document.styleSheets, function () {
        //   $.each(this.cssRules || this.rules, function () {
        //     if (re.test(this.selectorText))
        //       ret = true;
        //   });
        // });
        return true;
      }
    };
    return _utils;
  }());

  return OliveUI;
}));
