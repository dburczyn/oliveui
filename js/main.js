//Main entry point!

(function ($, OliveUI) {

  var oliveUI = OliveUI();

  $('#main').append(
    oliveUI.render()
  );

  var widget1 = oliveUI.createWidgetInstance('Microservice UI');
  var widget2 = oliveUI.createWidgetInstance('Microservice UI');
  var widget3 = oliveUI.createWidgetInstance('Javascript Render UI');
  var widget4 = oliveUI.createWidgetInstance('HTML Render UI');
  var widget5 = oliveUI.createWidgetInstance('Markdown Render UI');
  var widget6 = oliveUI.createWidgetInstance('Job Widget');
  var widget7 = oliveUI.createWidgetInstance('Grid Widget');


  oliveUI.setWidgetInstanceConfiguration(widget1, {
    microserviceInputs: {
      'Append Text': {
        value: 'World'
      }
    },
    microserviceOutputAdaptAlg: '',
    serviceName: 'Test 1'
  });

  oliveUI.setWidgetInstanceConfiguration(widget2, {
    microserviceInputs: {
      'Append Text': {
        value: 'Microservice result'
      }
    },
    microserviceOutputAdaptAlg: 'return output.dataText;',
    serviceName: 'Test 2'
  });

  oliveUI.setWidgetInstanceConfiguration(widget3, {
    javascriptAlg: `//You must return a dom object
return $('<button>This is a javascript generated button</button>').click(function () {
  alert('Button clicked');
});`
  });

  oliveUI.setWidgetInstanceConfiguration(widget4, {
    html: `<blockquote><b>This is a Bold HTML text</b></blockquote>`
  });

  oliveUI.setWidgetInstanceConfiguration(widget5, {
    text: `# This is a markdown text`
  });

  oliveUI.setWidgetInstanceConfiguration(widget6, {
    tilerendercontent : {"description":"NEW FROM OLIVE","picture":"https://cdn.newsapi.com.au/image/v1/9fdbf585d17c95f7a31ccacdb6466af9","email":"newfromolive@wp.pl","createdat":"1557735733799","updatedat":"1557735733799","datetype":"Training","type":"JobTile","name":"new from olivve"},
    gridrendercontent : {    indexfilename: "indexlist",indexurl: "https://api.github.com/repositories/175385549/contents/js",token: "0c67c12fa10eedf3e16c0e972f33cda3f6c6e9b1"}

  });
  oliveUI.setWidgetInstanceConfiguration(widget7, {
        // indexfilename: "indexlist",indexurl: "https://api.github.com/repositories/175385549/contents/js",token: "0c67c12fa10eedf3e16c0e972f33cda3f6c6e9b1"
  });


}(jQuery, OliveUI));
