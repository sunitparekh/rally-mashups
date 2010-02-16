YUI.add('swimlane-tests', function(Y) {

    Y.namespace('Mashups.Tests');

    Y.Mashups.Tests.SwimlaneTests = new Y.Test.Case({
        name : "Swimlane Tests",

        setUp : function () {

        },

        tearDown : function () {
            Y.Mashups.Swimlanes = null;
            Y.one(".swimlane-header").set("innerHTML","");
            Y.one(".swimlane-cards").set("innerHTML","");
            Y.one(".swimlane-footer").set("innerHTML","");
        },

        'should be able to create swimlane object with name' : function () {
            var swimlane = new Y.Mashups.Swimlane({ Name: "Ready For Code Review" });

            Y.Assert.isInstanceOf(Y.Mashups.Swimlane, swimlane);
            Y.Assert.areEqual("Ready For Code Review", swimlane.Name);
        },

        'should render swimlanes inside swimlane-header div': function () {
            Y.Mashups.Swimlanes = Y.Mashups.Tests.Data.KanbanSwimlanes;
            Y.Mashups.Swimlane.render();

            var swimlaneNodes = Y.one(".swimlane-header").all(".swimlane");
            Y.Assert.areEqual(12, swimlaneNodes.size());
        },

        'should render swimlanes inside swimlane-cards div': function () {
            Y.Mashups.Swimlanes = Y.Mashups.Tests.Data.KanbanSwimlanes;
            Y.Mashups.Swimlane.render();

            var swimlaneNodes = Y.one(".swimlane-cards").all(".swimlane");
            Y.Assert.areEqual(12, swimlaneNodes.size());
        },

        'should render swimlanes inside swimlane-footer div': function () {
            Y.Mashups.Swimlanes = Y.Mashups.Tests.Data.KanbanSwimlanes;
            Y.Mashups.Swimlane.render();

            var swimlaneNodes = Y.one(".swimlane-footer").all(".swimlane");
            Y.Assert.areEqual(12, swimlaneNodes.size());
        },

        'should provide valid html id for name with spaces': function() {
            var swimlane = new Y.Mashups.Swimlane({ Name: "Ready For Code Review" });
            Y.Assert.areEqual("Ready-For-Code-Review", swimlane.htmlID());
        }



    }

            )
}, '1.0', {requires: ['test','mashups-swimlane','mashups-test-data']});