(function ($, OliveUI, CodeMirror) {
  OliveUI.modules.new_brokerage_object_grid_widget_js = function (config = {}) {
    config.height = config.minHeight || 100;
    config.codemirror = config.codemirror || {
      mode: 'htmlmixed',
      tabSize: 2,
      lineNumbers: true,
      lineWrapping: true
    };


    'use strict';
    var widgetFileNames = [];
    var indexedListNames = [];
    var indexListobjToUpdate = {};
    indexListobjToUpdate.list = [];
    var functionnames = [];
    var resultsJSON = [];
    var unencodedcontent;
    var namesToAddToList;
    var namesToDeleteFromList;
    var updatedIndexList;
    var listsha;
    var widgetlist;
    var instance;
    widgetcontainer = document.createElement('div');
    widgetcontainerinner = document.createElement('div');
    var grid = {
      type: "Grid",
      render: function (gridrendercontent) {
        var getDataAjax = $.ajax({
          url: gridrendercontent.indexurl + "/" + gridrendercontent.indexfilename,
          beforeSend: setAuthHeader.bind(gridrendercontent),
          dataType: 'json'
        }).done(function (response) {
          resultsJSON = [];
          produceWidgetContent.call(null, response);
          if ((typeof gridrendercontent.token !== 'undefined') && (gridrendercontent.token != "") && (gridrendercontent.token != "defaulttoken")) {
            getListOfObjects(gridrendercontent); // used fo r creation/update of indexlist - only for admin = authenticated users
          }
        });

        function getSafe(fn, defaultVal) {
          try {
            return fn();
          } catch (e) {
            return defaultVal;
          }
        }

        widgetlistpre = [];
        widgetlist = [];

        for (const [key, value] of Object.entries(OliveUI.modules)) {
          widgetlistpre.push(value);
        }

        widgetlistpre.forEach(function (i) {
          widgetlist.push(getSafe(() => i(), 'placeholder'));
          if (typeof getSafe(() => i(), 'placeholder').type !== 'undefined' && functionnames.indexOf(i.type) == -1) {
            functionnames.push(getSafe(() => i(), 'placeholder').type);
          }
        });

        functionnames.forEach(function (name) {

          if (name !== "Grid") { // hardcoded to not add grid add button/container
            addWidgetContainer();
          }
        });
        $.when(getDataAjax).done(function () {
          instantiateWidgets(gridrendercontent);
        });
        return widgetcontainer;
      },
    };

    function setAuthHeader(request) {
      if ((typeof this.token !== 'undefined') && (this.token != "") && (this.token != "defaulttoken")) {
        request.setRequestHeader("Authorization", "token " + this.token);
      }
    }
    Array.prototype.diff = function (a) {
      return this.filter(function (i) {
        return a.indexOf(i) < 0;
      });
    };

    function arraysEqual(arr1, arr2) {
      if (arr1.length !== arr2.length)
        return false;
      for (var i = arr1.length; i--;) {
        if (arr1[i] !== arr2[i])
          return false;
      }
      return true;
    }

    function instantiateWidgets(gridrendercontent) {
      resultsJSON.forEach(function (widgetData) {
        if (functionnames.indexOf(widgetData.type) > -1) {

          widgetlist.forEach(function (widgetTypeName) {
            if (widgetTypeName.type === widgetData.type) {
              instance = Object.assign({}, widgetTypeName);
            }
          });

          $(widgetcontainerinner).append(instance.render(widgetData, gridrendercontent)); // here lands all content of widget instances
        }
      });
      widgetlist.forEach(function (i) {
        instance = Object.assign({}, i);
        if (typeof instance.makeCreateButton === "function") {
          instance.makeCreateButton(gridrendercontent);
        }
      });
    }

    function getListOfObjects(gridinstance) {
      $.ajax({
        url: gridinstance.indexurl,
        beforeSend: setAuthHeader.bind(gridinstance),
        dataType: 'json'
      }).done(function (results) {
        $.each(results, function (i, f) {
          if (f.name != gridinstance.indexfilename) {
            widgetFileNames.push(
              f.name
            );
          }
        });
        getDiffIndexList(gridinstance); // after having list of all widgetFileNames in repo, get list of indexed widgetFileNames
      });
    }
    // if no name on indexlist add object to indexlist
    function getDiffIndexList(gridinstance) {
      namesToAddToList = widgetFileNames.diff(indexedListNames);
      var differingRecordsRequests = [];
      namesToAddToList.forEach(function (nameToAddToList) {
        var request = $.ajax({
          url: gridinstance.indexurl + '/' + nameToAddToList,
          beforeSend: setAuthHeader.bind(gridinstance),
          dataType: 'json'
        }).done(function (response) {
          prepareUpdateList(response);
        });
        differingRecordsRequests.push(request);
      });
      $.when.apply(null, differingRecordsRequests).done(function () {
        prepareUpdatedIndexlist();
        pushUpdatedIndexlist(gridinstance);
      });
    }

    function prepareUpdateList(response) {
      var content = atob(response.content);
      var unencodedcontentdiff = JSON.parse(content);
      indexListobjToUpdate.list.push({
        createdat: unencodedcontentdiff.createdat,
        updatedat: unencodedcontentdiff.updatedat,
        datetype: unencodedcontentdiff.datetype,
        name: unencodedcontentdiff.name,
        type: unencodedcontentdiff.type
      });
    }


    function removeDuplicates(arr) {
      var unique_array = Array.from(new Set(arr));
      return unique_array;
    }


    function prepareUpdatedIndexlist() { // tutaj sie cos dzieje
      namesToDeleteFromList = indexedListNames.diff(widgetFileNames);
      updatedIndexList = {};
      updatedIndexList.list = unencodedcontent.list.concat(indexListobjToUpdate.list);
      for (var j = 0; j < namesToDeleteFromList.length; j++) {
        for (var i = 0; i < updatedIndexList.list.length; i++) {
          if (updatedIndexList.list[i].updatedat == namesToDeleteFromList[j]) {
            updatedIndexList.list.splice(i, 1);
          }
        }
      }




      updatedIndexList.list = removeDuplicates(updatedIndexList.list);
    }

    function pushUpdatedIndexlist(args) {
      if (!arraysEqual(unencodedcontent.list, updatedIndexList.list)) {
        $.ajax({
          url: args.indexurl + '/' + args.indexfilename,
          beforeSend: setAuthHeader.bind(args),
          type: 'PUT',
          data: '{"message": "create indexlist","sha":"' + listsha + '","content":"' + btoa(JSON.stringify(updatedIndexList)) + '" }',
          dataType: 'json',
        });
      }
    }

    function addWidgetContainer() {
      $(widgetcontainer)
        .appendTo($(document.body))
        .addClass("container")
        .append(
          $("<section/>")
          .addClass("cms-boxes")
          .append(
            $(widgetcontainerinner)
            .addClass("container-fluid")
          ));
    }

    function produceWidgetContent(response) {
      listsha = response.sha;
      unencodedcontent = JSON.parse(atob(response.content));
      $.each(unencodedcontent.list, function (i, f) {
        resultsJSON.push(f);
        indexedListNames.push( // used in indexlist creation
          f.updatedat
        );
      });
    }
    return grid;
  };

}(jQuery, OliveUI, CodeMirror));
