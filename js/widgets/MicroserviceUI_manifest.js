(function ($, OliveUI, newMicroserviceUI, newMicroserviceUI_configUI) {
  'use strict';

  var config = {
    mscEndpoint: 'https://www.adoxx.org/micro-service-controller-rest/rest/',
    microserviceId: '1738cb62-cc55-4abf-8560-feafdb83260c',
    operationId: 'default'
  };

  OliveUI.addWidgetManifest({

    name: 'Microservice UI',
    description: '',

    createUIFn: function () {
      return newMicroserviceUI({
        mscEndpoint: config.mscEndpoint
      });
    },

    createConfigurationUIFn: function () {
      return newMicroserviceUI_configUI({
        mscEndpoint: config.mscEndpoint,
        microserviceId: config.microserviceId,
        operationId: config.operationId,
        forceStartWhenStopped: true,
        showServiceNameTxt: true
      });
    },

    configurationMappingFn: function (widget, configurationUIOutputConfig, viewUIInputConfig) {
      if (!configurationUIOutputConfig.microserviceInputs) throw 'Widget not configured';
      Object.assign(viewUIInputConfig, {
        microserviceId: config.microserviceId,
        operationId: config.operationId,
        microserviceInputJSON: JSON.stringify(configurationUIOutputConfig.microserviceInputs),
        microserviceOutputAdaptAlg: configurationUIOutputConfig.microserviceOutputAdaptAlg,
      });
      if (configurationUIOutputConfig.serviceName)
        widget.setWidgetTitle(configurationUIOutputConfig.serviceName);
    }
    //TODO: add uiCustomRenderFn configUiCustomRenderFn uiCustomGetState...
  });

}(jQuery, OliveUI, OliveUI.modules.newMicroserviceUI, OliveUI.modules.newMicroserviceUI_configUI));
