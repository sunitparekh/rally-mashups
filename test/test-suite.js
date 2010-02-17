YUI.add('test-suite', function(Y) {
        Y.namespace("Mashups.Suite");
        Y.Mashups.Suite.ExampleSuite = new Y.Test.Suite("Rally Mashups Test Suite");
        Y.Mashups.Suite.ExampleSuite.add(Y.Mashups.Tests.SwimlaneTests);
        Y.Mashups.Suite.ExampleSuite.add(Y.Mashups.Tests.CardTests);

    }, '0.1', {requires: ['test','card-tests','swimlane-tests']}
);