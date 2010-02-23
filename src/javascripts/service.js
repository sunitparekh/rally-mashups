YUI.add('mashups-service', function(Y) {
    Y.namespace('Mashups');

    function Service(config) {
        Service.superclass.constructor.apply(this, arguments);
    }

    Service.NAME = 'service';
    Service.ATTRS = {
        mashupName: {value: null},
        filterType: {value: null},
        refreshCardsCallback: {value: null},
        beforeCardUpdateHook: {value: null}
    };

    Y.extend(Service, Y.Base, {
        initializer : function(config) {
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

        loadFilter: function() {
            Y.Mashups.FlashMessage.message.show("Please wait... loading filter options");
            this.filterDropdown = new RALLY.Mashup.Dropdown(this.batchToolkit, this.get('filterType'), "filter-dropdown", "filter-label", 'mu_iteration_status');
            this.filterDropdown.invoke(this.get("refreshCardsCallback"));
            Y.Mashups.FlashMessage.message.show("Please wait... loading swimlanes");
        },

        findCardsByFilter: function(callback) {
            Y.Mashups.FlashMessage.message.show("Please wait... loading cards for '" + this.filterDropdown.getSelectedName() + "'");
            var queryArr = [];
            var fields = "FormattedID,Name,ObjectID,ScheduleState,PlanEstimate,Owner,KanbanState,Blocked,Iteration";
            queryArr[0] =
            {
                key: 'defects',
                type: 'defect',
                fetch: fields,
                order: "Rank",
                query: "(" + this.get('filterType') + ".Name = " + "\"" + this.filterDropdown.getSelectedName() + "\")"
            };

            queryArr[1] =
            {
                key: "stories",
                type: "hierarchicalrequirement",
                fetch: fields,
                order: "Rank",
                query: "(" + this.get('filterType') + ".Name = " + "\"" + this.filterDropdown.getSelectedName() + "\")"
            };

            this.batchToolkit.findAll(queryArr, function(results) {
                var cards = new Y.Mashups.Cards();
                Y.each(results.stories, function(story) {
                    cards.addCard(new Y.Mashups.Story(story));
                });
                Y.each(results.defects, function(defect) {
                    cards.addCard(new Y.Mashups.Defect(defect));
                });
                if (cards.noOfCards() == 0){ Y.Mashups.FlashMessage.message.show("No cards found"); return; }
                callback(cards);
            });
        },

        updateCard : function(card, dataAsJSON, callback) {
            if (callback == undefined || callback == null) callback = this.get("refreshCardsCallback");

            var beforeCardUpdateHook = this.get('beforeCardUpdateHook');
            if (beforeCardUpdateHook != null) {
                dataAsJSON = beforeCardUpdateHook(card, dataAsJSON);
            }
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
                arguments: callback

            };

            this.execute(url, config);
        }

    });

    Y.Mashups.Service = Service;


}, '0.6', {requires: ['base','io']});