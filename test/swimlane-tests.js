YUI.add('swimlane-tests', function(Y) {

    Y.namespace('Mashups.Tests');

    Y.Mashups.Tests.SwimlaneTests = new Y.Test.Case({
        name : "Swimlane Tests",

        setUp : function () {
        },

        tearDown : function () {
        },

        'should be able to create swimlane object with name' : function () {
            var swimlane = new Y.Mashups.Swimlane({ Name: "Ready For Code Review", Label: "Different From Name"  });

            Y.Assert.isInstanceOf(Y.Mashups.Swimlane, swimlane);
            Y.Assert.areEqual("Ready For Code Review", swimlane.Name);
            Y.Assert.areEqual("Different From Name", swimlane.Label);
        },

        'should take Name when label is not available' : function () {
            var swimlane = new Y.Mashups.Swimlane({ Name: "Ready For Code Review"});

            Y.Assert.isInstanceOf(Y.Mashups.Swimlane, swimlane);
            Y.Assert.areEqual("Ready For Code Review", swimlane.Name);
            Y.Assert.areEqual("Ready For Code Review", swimlane.Label);
        },

        'should render swimlanes inside swimlane-header div': function () {
            var swimlanes = Y.Mashups.Tests.Data.KanbanSwimlanes;
            swimlanes.render();

            var swimlaneNodes = Y.one(".swimlane-header").all(".swimlane");
            Y.Assert.areEqual(12, swimlaneNodes.size());
        },

        'should render swimlanes inside swimlane-cards div': function () {
            var swimlanes = Y.Mashups.Tests.Data.KanbanSwimlanes;
            swimlanes.render();

            var swimlaneNodes = Y.one(".swimlane-cards").all(".swimlane");
            Y.Assert.areEqual(12, swimlaneNodes.size());
        },

        'should render swimlanes inside swimlane-footer div': function () {
            var swimlanes = Y.Mashups.Tests.Data.KanbanSwimlanes;
            swimlanes.render();

            var swimlaneNodes = Y.one(".swimlane-footer").all(".swimlane");
            Y.Assert.areEqual(12, swimlaneNodes.size());
        },

        'should provide valid html id for name with spaces and dots': function() {
            var swimlane = new Y.Mashups.Swimlane({ Name: "Ready.For.Code Review And Big Name" });
            Y.Assert.areEqual("Ready-For-Code-Review-And-Big-Name", swimlane.htmlID());
        },

        'should return appropriare siwmlane on findByName': function()  {
            var swimlanes = Y.Mashups.Tests.Data.KanbanSwimlanes;

            var swimlane = swimlanes.findByName("Ready For Code Review");

            Y.Assert.areEqual(swimlanes.indexOf(6),swimlane);
            Y.Assert.areEqual("Ready-For-Code-Review",swimlane.htmlID());
        },

        'should create swimlane based on estimate': function() {
            var swimlanes = Y.Mashups.Tests.Data.EstimateSwimlanes;
            swimlanes.render();

            var swimlaneNodes = Y.one(".swimlane-header").all(".swimlane");
            Y.Assert.areEqual(6, swimlaneNodes.size());

        }



    }

            )
}, '1.0', {requires: ['test','mashups-swimlane','mashups-global','mashups-test-data']});