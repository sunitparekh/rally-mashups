YUI.add('action-menu-tests', function(Y) {

    Y.namespace('Mashups.Tests');

    Y.Mashups.Tests.ActionMenuTests = new Y.Test.Case({
        name : "Action Menu Tests",

        setUp : function () {
            Y.Cookie.remove("MashupsName-Swimlanes"); // remove cookie after verification
        },

        tearDown : function () {
            new Y.Mashups.ActionMenu().clear();
        },

        'should create show/hide action menu based on kanban swimlanes': function() {
            var swimlanes = Y.Mashups.Tests.Data.KanbanSwimlanes();
            swimlanes.renderSwimlanes();

            var actionMenu = new Y.Mashups.ActionMenu();
            actionMenu.buildMenu(swimlanes);
            actionMenu.show();

            Y.Assert.areEqual(12,Y.all("#show-swimlane li").size());
            Y.Assert.areEqual(12,Y.all("#hide-swimlane li").size());

        },

        'should create only show action menu based on kanban swimlanes': function() {
            var swimlanes = Y.Mashups.Tests.Data.KanbanSwimlanes();
            swimlanes.renderSwimlanes();

            var actionMenu = new Y.Mashups.ActionMenu({hideSwimlane: false});
            actionMenu.buildMenu(swimlanes);
            actionMenu.show();

            Y.Assert.areEqual(12,Y.all("#show-swimlane li").size());
            Y.Assert.areEqual(0,Y.all("#hide-swimlane li").size());

        },

        'should create only hide action menu based on kanban swimlanes': function() {
            var swimlanes = Y.Mashups.Tests.Data.KanbanSwimlanes();
            swimlanes.renderSwimlanes();

            var actionMenu = new Y.Mashups.ActionMenu({showSwimlane: false});
            actionMenu.buildMenu(swimlanes);
            actionMenu.show();

            Y.Assert.areEqual(12,Y.all("#hide-swimlane li").size());
            Y.Assert.areEqual(0,Y.all("#show-swimlane li").size());

        },

        'should create show/hide action menu based on estimation swimlanes': function() {
            var swimlanes = Y.Mashups.Tests.Data.EstimateSwimlanes();
            swimlanes.renderSwimlanes();

            var actionMenu = new Y.Mashups.ActionMenu();
            actionMenu.buildMenu(swimlanes);
            actionMenu.show();

            Y.Assert.areEqual(7,Y.all("#show-swimlane li").size());
            Y.Assert.areEqual(7,Y.all("#hide-swimlane li").size());

        }



    }

            )
}, '1.0', {requires: ['test','mashups-swimlane','mashups-global','mashups-test-data','mashups-action-menu']});