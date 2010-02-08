YUI.add('card-tests', function(Y) {

    Y.namespace('Mashups.Tests');

    Y.Mashups.Tests.CardTests = new Y.Test.Case({
        name : "Card Tests",

        'user story type card should be of type Story' : function () {
            Y.Assert.isInstanceOf(Y.Mashups.Story, new Y.Mashups.Story(), "object is not of instance Story");
        },

        'user story type card should be of type Card' : function () {
            Y.Assert.isInstanceOf(Y.Mashups.Card, new Y.Mashups.Story(), "object is not of instance Card");
        },

        'defect type card should be of type Defect' : function () {
            Y.Assert.isInstanceOf(Y.Mashups.Defect, new Y.Mashups.Defect(), "object is not of instance Defect");
        },

        'defect type card should be of type Card' : function () {
            Y.Assert.isInstanceOf(Y.Mashups.Card, new Y.Mashups.Defect(), "object is not of instance Card");
        },

        'should fail' : function () {
            Y.Assert.fail();
        }
    })
}, '0.6', {requires: ['test','mashups-card']});