YUI.add('mashups-service', function(Y) {
    Y.namespace('Mashups');

    function Service(config) {
        Service.superclass.constructor.apply(this, arguments);
    }

    Service.NAME = 'service';
    Service.ATTRS = {};

    Y.extend(Service, Y.Base, {
        initializer : function(config) {
            Y.Mashups.FlashMessage.message.hide();
            var self = this;
            Y.each(config, function(value, index) {
                self[index] = value;
            });
            this.batchToolkit = new RALLY.Mashup.BatchToolkit('__WORKSPACE_OID__', '__PROJECT_OID__', '__PROJECT_SCOPING_UP__', '__PROJECT_SCOPING_DOWN__');
        },

        execute : function(url, config) {
            Y.io(url, config);
        },

        findOwnerNameByEmailId : function(card) {
            var url = '/slm/webservice/1.14/user.js?query=(EmailAddress = ' + card.Owner + ' )';
            var config = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                on: {
                    success: function (x, o, card) {
                        var ownerName = null;
                        var response = Y.JSON.parse(o.responseText);
                        var ownerObject = response['QueryResult']['Results'][0];
                        if (ownerObject != null) {
                            ownerName = ownerObject['_refObjectName'];
                        }
                        card.updateOwnerName(ownerName);
                    }
                },
                arguments: card
            };

            this.execute(url, config);
        },

        loadFilter: function(filterType, callback) {
            Y.Mashups.FlashMessage.message.show("Please wait... loading filter options");
            this.filterDropdown = new RALLY.Mashup.Dropdown(this.batchToolkit, filterType, "filter-dropdown", "filter-label", 'mu_iteration_status');
            this.filterDropdown.invoke(callback);
            Y.Mashups.FlashMessage.message.show("Please wait... loading swimlanes");
        },

        findKanbanStatesAsSwimlanes: function() {
            return new Y.Mashups.Swimlanes({ service: this })
                    .addSwimlane(new Y.Mashups.Swimlane({ Name: "Defined", data : '{ "KanbanState": "Defined", "ScheduleState": "Backlog" }' }))
                    .addSwimlane(new Y.Mashups.Swimlane({ Name: "Prioritised", data : '{ "KanbanState": "Prioritised", "ScheduleState": "Backlog" }'  }))
                    .addSwimlane(new Y.Mashups.Swimlane({ Name: "In Analysis", data : '{ "KanbanState": "In Analysis", "ScheduleState": "Backlog" }'  }))
                    .addSwimlane(new Y.Mashups.Swimlane({ Name: "Ready For Development", data : '{ "KanbanState": "Ready For Development", "ScheduleState": "Defined" }'  }))
                    .addSwimlane(new Y.Mashups.Swimlane({ Name: "In Development", data : '{ "KanbanState": "In Development", "ScheduleState": "In-Progress" }'  }))
                    .addSwimlane(new Y.Mashups.Swimlane({ Name: "Ready For Code Review", data : '{ "KanbanState": "Ready For Code Review", "ScheduleState": "In-Progress" }'  }))
                    .addSwimlane(new Y.Mashups.Swimlane({ Name: "In Code Review", data : '{ "KanbanState": "In Code Review", "ScheduleState": "In-Progress" }'  }))
                    .addSwimlane(new Y.Mashups.Swimlane({ Name: "Ready For Test", data : '{ "KanbanState": "Ready For Test", "ScheduleState": "In-Progress" }'  }))
                    .addSwimlane(new Y.Mashups.Swimlane({ Name: "In Test" , data : '{ "KanbanState": "In Test", "ScheduleState": "In-Progress" }' }))
                    .addSwimlane(new Y.Mashups.Swimlane({ Name: "Ready For Acceptance", data : '{ "KanbanState": "Ready For Acceptance", "ScheduleState": "Completed" }'  }))
                    .addSwimlane(new Y.Mashups.Swimlane({ Name: "Accepted" , data : '{ "KanbanState": "Accepted", "ScheduleState": "Accepted" }' }));

        },

        findCardsByFilter: function(filterType, callback) {
            Y.Mashups.FlashMessage.message.show("Please wait... loading cards for '" + this.filterDropdown.getSelectedName() + "'");
            var queryArr = [];
            var fields = "FormattedID,Name,ObjectID,ScheduleState,PlanEstimate,Owner,KanbanState,Blocked,Iteration";
            queryArr[0] =
            {
                key: 'defects',
                type: 'defect',
                fetch: fields,
                order: "Rank",
                query: "(" + filterType + ".Name = " + "\"" + this.filterDropdown.getSelectedName() + "\")"
            };

            queryArr[1] =
            {
                key: "stories",
                type: "hierarchicalrequirement",
                fetch: fields,
                order: "Rank",
                query: "(" + filterType + ".Name = " + "\"" + this.filterDropdown.getSelectedName() + "\")"
            };

            this.batchToolkit.findAll(queryArr, function(results) {
                var cards = new Y.Mashups.Cards();
                Y.each(results.stories, function(story) {
                    cards.addCard(new Y.Mashups.Story(story));
                });
                Y.each(results.defects, function(defect) {
                    cards.addCard(new Y.Mashups.Defect(defect));
                });

                callback(cards);
            });
        },

        updateCard : function(card, dataAsJSON) {
            var url = '/slm/webservice/1.14/' + card.get('rallyType') + '/' + card.ObjectID + ".js";
            var config = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                data: dataAsJSON,
                on: {
                    success: function (ioId, o, callback) {
                        var response = Y.JSON.parse(o.responseText);
                        if (response['OperationResult']['Errors'].length > 0) {
                            Y.Mashups.FlashMessage.error.show('Failed updating state. \n Response:' + o.responseText);
                        } else {
                            Y.Mashups.FlashMessage.message.show("Card updated successfully.");
                        }
                        callback();
                    },
                    failure: function (ioId, o, callback) {
                        Y.Mashups.FlashMessage.error.show('Failed updating state. \n Response:' + o.responseText);
                        callback();
                    }
                },
                arguments: this.refreshCardsCallback

            };

            this.execute(url, config);
        }

    });

    Y.Mashups.Service = Service;


}, '0.6', {requires: ['base','io']});