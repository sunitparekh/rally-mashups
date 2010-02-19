YUI.add('mashups-service', function(Y) {
    Y.namespace('Mashups');

    function Service(data) {
        Service.superclass.constructor.apply(this, arguments);
    }

    Service.NAME = 'service';
    Service.ATTRS = {};

    Y.extend(Service, Y.Base, {
        initialiser : function(config) {
            Y.io.header('Content-Type', 'application/json');
        },

        getBatchToolkit: function() {
            if (this.batchToolkit == null || this.batchToolkit == undefined)
                this.batchToolkit = new RALLY.Mashup.BatchToolkit('__WORKSPACE_OID__', '__PROJECT_OID__', '__PROJECT_SCOPING_UP__', '__PROJECT_SCOPING_DOWN__');
            return this.batchToolkit;
        },

        execute : function(url, config) {
            Y.io(url, config);
        },

        findOwnerNameByEmailId : function(card) {
            var url = '/slm/webservice/1.14/user.js?query=(EmailAddress = ' + card.Owner + ' )';
            var config = {
                method: 'GET',
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
            this.iterationDropdown = new RALLY.Mashup.Dropdown(this.getBatchToolkit(), filterType, "filter-dropdown", "filter-label", 'mu_iteration_status');
            this.iterationDropdown.invoke(callback);
        },

        findKanbanStatesAsSwimlanes: function() {
            return new Y.Mashups.Swimlanes({ service: this })
                    .addSwimlane(new Y.Mashups.Swimlane({ Name: "Defined" }))
                    .addSwimlane(new Y.Mashups.Swimlane({ Name: "Prioritised" }))
                    .addSwimlane(new Y.Mashups.Swimlane({ Name: "In Analysis" }))
                    .addSwimlane(new Y.Mashups.Swimlane({ Name: "Ready For Development" }))
                    .addSwimlane(new Y.Mashups.Swimlane({ Name: "In Development" }))
                    .addSwimlane(new Y.Mashups.Swimlane({ Name: "Ready For Code Review" }))
                    .addSwimlane(new Y.Mashups.Swimlane({ Name: "In Code Review" }))
                    .addSwimlane(new Y.Mashups.Swimlane({ Name: "Ready For Test" }))
                    .addSwimlane(new Y.Mashups.Swimlane({ Name: "In Test" }))
                    .addSwimlane(new Y.Mashups.Swimlane({ Name: "Ready For Acceptance" }))
                    .addSwimlane(new Y.Mashups.Swimlane({ Name: "Accepted" }));

        },

        findCardsByFilter: function(filterType, callback) {
            var queryArr = [];

            var fields = "FormattedID,Name,ObjectID,ScheduleState,PlanEstimate,Owner,KanbanState,Blocked,Iteration";
            queryArr[0] =
            {
                key: 'defects',
                type: 'defect',
                fetch: fields,
                order: "Rank",
                query: "(" + filterType + ".Name = " + "\"" + this.iterationDropdown.getSelectedName() + "\")"
            };

            queryArr[1] =
            {
                key: "stories",
                type: "hierarchicalrequirement",
                fetch: fields,
                order: "Rank",
                query: "(" + filterType + ".Name = " + "\"" + this.iterationDropdown.getSelectedName() + "\")"
            };

            this.getBatchToolkit().findAll(queryArr, function(results) {
                var cards = new Y.Mashups.Cards();
                Y.each(results.stories, function(story) { cards.addCard(new Y.Mashups.Story(story)); });
                Y.each(results.defects, function(defect) { cards.addCard(new Y.Mashups.Defect(defect)); });

                callback(cards);
            });
        }

    });

    Y.Mashups.Service = Service;


}, '0.6', {requires: ['base','io']});