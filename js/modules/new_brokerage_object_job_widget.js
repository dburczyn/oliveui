

(function ($, OliveUI, CodeMirror) {
  OliveUI.modules.new_brokerage_object_job_widget = function (config = {}) {
    config.height = config.minHeight || 100;
    config.codemirror = config.codemirror || {
      mode: 'htmlmixed',
      tabSize: 2,
      lineNumbers: true,
      lineWrapping: true
    };


  'use strict';
    var jobStatics = {
        bgcolor: "#c9cadc",
        icon: "fas fa-briefcase fa-3x",
        localeOptions: {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        },
        locale: "en-GB"
    };
    var currentresponse;
    var unencodedcontent;
    var jobtileinstance;
    var widgetRepresentation;
    var filecontentfield = document.createElement('input');
    var eventpicturefield = document.createElement('input');
    var emailaddressfield = document.createElement('input');
    var createdatfield = document.createElement('input');
    var updatedatfield = document.createElement('input');
    var filenamefield = document.createElement('input');
    var createform = document.createElement('div');
    var expandedWidgetView = document.createElement('div');
    var modalcontainer = document.createElement('div');
    var widgetAddButton = document.createElement('button');
    var jobtype;
    var gridrendercontent;
    var returned = {
         type: "JobTile",
/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
        render: function (renderdata, gridrendercontent) {
            widgetRepresentation = document.createElement('div');
            jobtileinstance = renderdata;
            if (typeof gridrendercontent !== 'undefined') {
                gridrendercontent.token = gridrendercontent.token;
                gridrendercontent.indexurl = gridrendercontent.indexurl;
            }
            createFrontWidgetTile(gridrendercontent);
                      return widgetRepresentation;
        },
        makeCreateButton: function (gridrendercontent) {
            gridrendercontent = gridrendercontent;
                $(widgetAddButton)
                  .appendTo($(widgetRepresentation))
                  .addClass("btn btn-info")
                  .text('NEW ');
                  addNewButtonHandler(gridrendercontent);
        },
    };
    function setWidgetAuthHeader(request) {
        if (this.token !== "") {
            request.setRequestHeader("Authorization", "token " + this.token);
        }
    }
    function getJobtypeFromRadio() {

        var jobtypesradio = document.getElementsByName('jobtype');
        for (var i = 0; i < jobtypesradio.length; i++) {
            if (jobtypesradio[i].checked) {
                jobtype = jobtypesradio[i].value;
                break;
            }
        }
        return jobtype;
    }
    function produceWidgetInstanceContent() {
        widgetInstanceContent = {};
        widgetInstanceContent.description = $(filecontentfield).val();
        widgetInstanceContent.picture = $(eventpicturefield).val();
        widgetInstanceContent.email = $(emailaddressfield).val();
        widgetInstanceContent.createdat = $(createdatfield).val();
        widgetInstanceContent.updatedat = $(updatedatfield).val();
        widgetInstanceContent.datetype = getJobtypeFromRadio();
        widgetInstanceContent.type = returned.type;
        widgetInstanceContent.name = $(filenamefield).val();
        return widgetInstanceContent;
    }
    function makeCreateForm() {
        $(modalcontainer).empty();
        $(modalcontainer).append(
            $(createform)
            .addClass("modal")
            .attr("role", "dialog")
            .append(
                $('<div/>')
                .addClass("modal-dialog")
                .append(
                    $('<div/>')
                    .addClass("modal-content")
                    .append( /// header
                        $('<div/>')
                        .addClass("modal-header")
                        .append(
                            $('<button/>')
                            .addClass("close")
                            .attr("type", "button")
                            .attr("data-dismiss", "modal")
                            .text("x")
                        )
                        .append(
                            $("<h4/>")
                            .text("Create form")
                        )
                    )
                    .append( //body
                        $('<div/>')
                        .addClass("modal-body")
                        .append(
                            $('<form/>')
                            .addClass("form-style-5")
                            .append(
                                $(createdatfield)
                                .attr("type", "text")
                                .attr("hidden", "true")
                            )
                            .append(
                                $(updatedatfield)
                                .attr("type", "text")
                                .attr("hidden", "true")
                            )
                            .append(
                                $('<p/>')
                                .text("Name:")
                            )
                            .append(
                                $(filenamefield)
                                .attr("type", "text")
                            )
                            .append(
                                $('<p/>')
                                .text("Description:")
                            )
                            .append(
                                $(filecontentfield)
                                .attr("type", "text")
                            )
                            .append(
                                $('<p/>')
                                .text("Picture:")
                            )
                            .append(
                                $(eventpicturefield)
                                .attr("type", "text")
                            )
                            .append(
                                $('<p/>')
                                .text("Contact:")
                            )
                            .append(
                                $(emailaddressfield)
                                .attr("type", "text")
                            )
                            .append(
                                $('<p/>')
                                .text("Job type:")
                            )
                            .append(
                                $('<p/>')
                                .append(
                                    $('<input/>')
                                    .attr("value", "Employment")
                                    .attr("name", "jobtype")
                                    .attr("type", "radio")
                                    .attr("checked", "true")
                                )
                                .append(
                                    $('<p/>')
                                    .text("Employment")
                                )
                                .append(
                                    $('<input/>')
                                    .attr("value", "Training")
                                    .attr("name", "jobtype")
                                    .attr("type", "radio")
                                )
                                .append(
                                    $('<p/>')
                                    .text("Training")
                                )
                                .append(
                                    $('<input/>')
                                    .attr("value", "Internship")
                                    .attr("name", "jobtype")
                                    .attr("type", "radio")
                                )
                                .append(
                                    $('<p/>')
                                    .text("Internship")
                                )
                                .append(
                                    $('<input/>')
                                    .attr("value", "Master")
                                    .attr("name", "jobtype")
                                    .attr("type", "radio")
                                )
                                .append(
                                    $('<p/>')
                                    .text("Master")
                                )
                                .append(
                                    $('<input/>')
                                    .attr("value", "PhD")
                                    .attr("name", "jobtype")
                                    .attr("type", "radio")
                                )
                                .append(
                                    $('<p/>')
                                    .text("PhD")
                                )
                            )
                            .append(
                                $('<input>')
                                .attr("value", "Submit")
                                .attr("type", "submit")
                            )
                        )
                    )
                    .append( /// footer
                        $('<div/>')
                        .addClass("modal-footer")
                        .append(
                            $('<button/>')
                            .addClass("btn btn-default")
                            .attr("type", "button")
                            .attr("data-dismiss", "modal")
                            .text("Close")
                        )
                    )
                )));
    }
    function prepareDeleteWidgetContentUrl(gridrendercontent) {
      //  alert(gridrendercontent);
        return gridrendercontent.indexurl + "/" + currentresponse.name;
    }
    function deleteWidgetContentFile(gridrendercontent) {
        $.ajax({
                url: prepareDeleteWidgetContentUrl(gridrendercontent),
                beforeSend: setWidgetAuthHeader.bind(gridrendercontent),
                type: 'DELETE',
                data: '{"message": "delete file","sha":"' + currentresponse.sha + '" }',
            })
            .done(function () {
                $(expandedWidgetView).modal('hide');
            });
    }
    function prepareCreateWidgetContentUrl(gridrendercontent) {
        return gridrendercontent.indexurl + '/' + widgetInstanceContent.updatedat;
    }
    function createWidgetContentFile(gridrendercontent) {
        produceWidgetInstanceContent();
        $.ajax({
                url: prepareCreateWidgetContentUrl(gridrendercontent),
                beforeSend: setWidgetAuthHeader.bind(gridrendercontent),
                type: 'PUT',
                data: '{"message": "create file","content":"' + btoa(JSON.stringify(widgetInstanceContent)) + '" }',
            })
            .done(function () {
                $(createform).modal('hide');
                if (widgetInstanceContent.updatedat !== widgetInstanceContent.createdat) {
                    deleteWidgetContentFile(gridrendercontent);
                }
            });
    }
    function addCreateFormSubmitHandler(gridrendercontent) {
        $(createform).on('submit', function (e) {
            e.preventDefault();
            createWidgetContentFile(gridrendercontent);
        });
    }
    function createFrontWidgetTile(gridrendercontent) {
        var parsedcreatedat = new Date(parseInt(jobtileinstance.createdat)).toLocaleDateString(jobStatics.locale, jobStatics.localeOptions);
        var parsedupdatedat = new Date(parseInt(jobtileinstance.updatedat)).toLocaleDateString(jobStatics.locale, jobStatics.localeOptions);
        $(widgetRepresentation)
            .addClass("col-md-3 cms-boxes-outer")
            .append(
                $("<div/>")
                .addClass("cms-boxes-items cms-features")
                .css({
                    "background-color": jobStatics.bgcolor
                })
                .append(
                    $("<div/>")
                    .addClass("boxes-align")
                    .attr("id", jobtileinstance.updatedat)
                    .on('click', function () {
                        showInnerWidgetModal($(this).attr("id"),gridrendercontent);
                    })
                    .append(
                        $("<div/>")
                        .addClass("small-box")
                        .append(
                            $("<i/>")
                            .addClass(jobStatics.icon)
                        )
                        .append(
                            $("<h3/>")
                            .text(jobtileinstance.name)
                        )
                        .append(
                            $("<h4/>")
                            .text("Type: " + jobtileinstance.datetype)
                        )
                        .append(
                            $("<h5/>")
                            .text("Last update: " + parsedupdatedat)
                        )
                        .append(
                            $("<h5/>")
                            .text("Created: " + parsedcreatedat)
                        ))))
            .append(modalcontainer);
    }
    function createInnerWidgetModal(gridrendercontent) {
        $(modalcontainer).empty();
        $(modalcontainer).append(
            $(expandedWidgetView)
            .addClass("modal")
            .attr("role", "dialog")
            .append(
                $('<div/>')
                .addClass("modal-dialog")
                .append(
                    $('<div/>')
                    .addClass("modal-content")
                    .append( /// header
                        $('<div/>')
                        .addClass("modal-header")
                        .append(
                            $('<button/>')
                            .addClass("close")
                            .attr("type", "button")
                            .attr("data-dismiss", "modal")
                            .text("x")
                        )
                        .append(
                            $('<img>')
                            .attr("src", unencodedcontent.picture)
                        )
                    )
                    .append(
                        $('<div/>')
                        .addClass("modal-body")
                        .append(
                            $("<h1/>")
                            .addClass("modal-title")
                            .css({
                                "text-align": "center"
                            })
                            .text(unencodedcontent.name)
                        )
                        .append(
                            $("<h2/>")
                            .css({
                                "text-align": "center"
                            })
                            .text(unencodedcontent.datetype)
                        )
                        .append(
                            $("<p/>")
                            .text(unencodedcontent.description)
                        )
                        .append(
                            $("<p/>")
                            .append(
                                $("<a/>")
                                .attr("href", 'mailto:' + unencodedcontent.email)
                                .addClass("btn btn-primary")
                                .css({
                                    "display": "block",
                                    "margin-left": "auto",
                                    "margin-right": "auto"
                                })
                                .text("Apply")
                            )
                        )
                        .append(
                            $("<p/>")
                            .append(
                                $("<strong/>")
                                .text("Updated: ")
                            )
                            .append(
                                $("<time/>")
                                .text(new Date(parseInt(unencodedcontent.updatedat)).toLocaleDateString(jobStatics.locale, jobStatics.localeOptions))
                            )
                        )
                        .append(
                            $("<p/>")
                            .append(
                                $("<strong/>")
                                .text("Created: ")
                            )
                            .append(
                                $("<time/>")
                                .text(new Date(parseInt(unencodedcontent.createdat)).toLocaleDateString(jobStatics.locale, jobStatics.localeOptions))
                            )
                        )
                    )
                    .append( /// footer
                        $('<div/>')
                        .addClass("modal-footer")
                        .append(
                            $('<button/>')
                            .addClass("btn btn-default")
                            .attr("type", "button")
                            .attr("data-dismiss", "modal")
                            .text("Close")
                        )
                        .append(
                            $('<button/>')
                            .addClass("btn btn-default")
                            .attr("type", "button")
                            .text("Delete")
                            .on('click', function (e) {
                                var action = confirm('Are you sure you wish to delete this item ? It cannot be undone!');
                                if (action === false) {
                                    return false;
                                }
                                deleteWidgetContentFile(gridrendercontent);
                            })
                        )
                        .append(
                            $('<button/>')
                            .addClass("btn btn-info")
                            .attr("type", "button")
                            .attr("data-toggle", "modal")
                            .attr("data-target", createform)
                            .text("Edit")
                            .on('click', function (e) {
                                e.stopPropagation();
                                $(expandedWidgetView).modal('hide');
                                createform = document.createElement('div');
                                makeCreateForm();
                                addCreateFormSubmitHandler(gridrendercontent);
                                populateEditForm();
                                $(createform).modal('show');
                            })
                        )
                    )
                )));
    }
    function addNewButtonHandler(gridrendercontent) {
        $(widgetAddButton)
            .unbind('click')
            .on('click', function (e) {
                e.stopPropagation();
                createform = document.createElement('div');
                makeCreateForm();
                addCreateFormSubmitHandler(gridrendercontent);
                $(createdatfield).val(new Date().getTime());
                $(updatedatfield).val($(createdatfield).val());
                $(filenamefield).val('');
                $(filecontentfield).val('');
                $(emailaddressfield).val('');
                $(eventpicturefield).val('');
             $(modalcontainer).appendTo($(document.body));
                $(createform).modal('show');
            });
    }
    function populateEditForm() {
        updatedat = new Date().getTime();
        $(updatedatfield).val(updatedat);
        $(createdatfield).val(unencodedcontent.createdat);
        $(filenamefield).val(unencodedcontent.name);
        $(filecontentfield).val(unencodedcontent.description);
        $(emailaddressfield).val(unencodedcontent.email);
        $(eventpicturefield).val(unencodedcontent.picture);
        var typeseditedradionew = document.getElementsByName('jobtype');
        for (var j = 0, l = typeseditedradionew.length; j < l; j++) {
            if (unencodedcontent.datetype === typeseditedradionew[j].value) {
                typeseditedradionew[j].checked = true;
                break;
            }
        }
    }
    function showInnerWidgetModal(id,gridrendercontent) {
        $.ajax({
                url: gridrendercontent.indexurl + "/" + id,
                beforeSend: setWidgetAuthHeader.bind(gridrendercontent),
                dataType: 'json'
            })
            .done(function (response) {
                currentresponse = response;
                unencodedcontent = JSON.parse(atob(response.content));
                expandedWidgetView = document.createElement('div');
                createInnerWidgetModal(gridrendercontent);
                $(expandedWidgetView).modal('show');
            })
            .fail(function () {
                alert('That entry is no longer avaliable');
            });
    }

return returned;
};

  }(jQuery, OliveUI, CodeMirror));
