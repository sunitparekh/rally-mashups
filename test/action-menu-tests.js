YUI.add('action-menu-tests', function(Y) {

    Y.namespace('Mashups.Tests');

    Y.Mashups.Tests.ActionMenuTests = new Y.Test.Case({
        name : "Action Menu Tests",

        setUp : function () {
            Y.Cookie.remove("MashupsName-Swimlanes");
            Y.Cookie.remove("swimlanes");
        },

        tearDown : function () {
            new Y.Mashups.ActionMenu().clear();
        },

        'should create show/hide action menu based on kanban swimlanes': function() {
            var swimlanes = Y.Mashups.Tests.Data.KanbanSwimlanes();
            swimlanes.renderSwimlanes();

            var actionMenu = new Y.Mashups.ActionMenu({moveToIteration: false});
            actionMenu.buildMenu(swimlanes);
            actionMenu.show();

            Y.Assert.areEqual(12,Y.all("#show-swimlane li").size());
            Y.Assert.areEqual(12,Y.all("#hide-swimlane li").size());

        },

        'should create only show action menu based on kanban swimlanes': function() {
            var swimlanes = Y.Mashups.Tests.Data.KanbanSwimlanes();
            swimlanes.renderSwimlanes();

            var actionMenu = new Y.Mashups.ActionMenu({hideSwimlane: false,moveToIteration: false});
            actionMenu.buildMenu(swimlanes);
            actionMenu.show();

            Y.Assert.areEqual(12,Y.all("#show-swimlane li").size());
            Y.Assert.areEqual(0,Y.all("#hide-swimlane li").size());

        },

        'should create only hide action menu based on kanban swimlanes': function() {
            var swimlanes = Y.Mashups.Tests.Data.KanbanSwimlanes();
            swimlanes.renderSwimlanes();

            var actionMenu = new Y.Mashups.ActionMenu({showSwimlane: false,moveToIteration: false});
            actionMenu.buildMenu(swimlanes);
            actionMenu.show();

            Y.Assert.areEqual(12,Y.all("#hide-swimlane li").size());
            Y.Assert.areEqual(0,Y.all("#show-swimlane li").size());

        },

        'should create show/hide action menu based on estimation swimlanes': function() {
            var swimlanes = Y.Mashups.Tests.Data.EstimateSwimlanes();
            swimlanes.renderSwimlanes();

            var actionMenu = new Y.Mashups.ActionMenu({moveToIteration: false});
            actionMenu.buildMenu(swimlanes);
            actionMenu.show();

            Y.Assert.areEqual(7,Y.all("#show-swimlane li").size());
            Y.Assert.areEqual(7,Y.all("#hide-swimlane li").size());

        },

        'should hide swimlanes for mashup stated in cookie': function() {
            var serviceMock = new Y.Mashups.Stubs.Service({mashupName: "MyMashup"});
            var swimlanes = Y.Mashups.Tests.Data.KanbanSwimlanes();
            swimlanes.set('service', serviceMock);
            swimlanes.renderSwimlanes();

            var actionMenu = new Y.Mashups.ActionMenu({moveToIteration: false});
            Y.Cookie.setSub("MyMashup.swimlanes","Defined","hide", { expires: new Date("January 12, 2025") });
            actionMenu.buildMenu(swimlanes);
            actionMenu.show();

            Y.Assert.isTrue(Y.one("#header-Defined").hasClass("hide"));
            Y.Assert.isTrue(Y.one("#cards-Defined").hasClass("hide"));
            Y.Assert.isTrue(Y.one("#footer-Defined").hasClass("hide"));

        }



    }

            )
}, '1.0', {requires: ['test','mashups-swimlane','mashups-global','mashups-test-data','mashups-action-menu']});