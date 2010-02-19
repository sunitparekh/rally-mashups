YUI.add('card-tests', function(Y) {

    Y.namespace('Mashups.Tests');

    Y.Mashups.Tests.CardTests = new Y.Test.Case({
        name : "Card Tests",

        setUp : function () {
            Y.Cookie.remove("email-name"); // remove cookie after verification
        },

        tearDown : function () {
        },

        'user story type card should be of type Story' : function () {
            Y.Assert.isInstanceOf(Y.Mashups.Story, new Y.Mashups.Story(Y.Mashups.Tests.Data.StoriesAsData[0]), "object is not of instance Story");
        },

        'user story type card should be of type Card' : function () {
            Y.Assert.isInstanceOf(Y.Mashups.Card, new Y.Mashups.Story(Y.Mashups.Tests.Data.StoriesAsData[0]), "object is not of instance Card");
        },

        'defect type card should be of type Defect' : function () {
            Y.Assert.isInstanceOf(Y.Mashups.Defect, new Y.Mashups.Defect(Y.Mashups.Tests.Data.DefectsAsData[0]), "object is not of instance Defect");
        },

        'defect type card should be of type Card' : function () {
            Y.Assert.isInstanceOf(Y.Mashups.Card, new Y.Mashups.Defect(Y.Mashups.Tests.Data.DefectsAsData[0]), "object is not of instance Card");
        },

        'should be able to return the appropriate values from story card' : function() {
            var storyData = {
                ObjectID: 325594710,
                FormattedID: "US10266",
                Name: "short name for test",
                Owner: "tajuddin.baig@ge.com",
                Blocked: false,
                PlanEstimate: 1.0,
                Rank: 8.596,
                ScheduleState: "Backlog",
                KanbanState: "Defined"
            };
            var story = new Y.Mashups.Story(storyData);
            Y.Assert.areEqual(325594710, story.ObjectID);
            Y.Assert.areEqual("US10266", story.FormattedID);
            Y.Assert.areEqual("short name for test", story.Name);
            Y.Assert.areEqual("tajuddin.baig@ge.com", story.Owner);
            Y.Assert.areEqual(false, story.Blocked);
            Y.Assert.areEqual(1.0, story.PlanEstimate);
            Y.Assert.areEqual(8.596, story.Rank);
            Y.Assert.areEqual("Backlog", story.ScheduleState);
            Y.Assert.areEqual("Defined", story.KanbanState);
        },

        'should be able to return the appropriate values from defect card' : function() {
            var defectData = {
                ObjectID: 324298394,
                FormattedID: "DE898",
                Name: "CRD CBG00130781: [eng] Infinite loop if swg_merge.ds is hard_readonly",
                Owner: "steve.canavan@ge.com",
                Blocked: false,
                PlanEstimate: 5.0,
                Rank: 8470.491,
                ScheduleState: "In-Progress",
                KanbanState: "In Code Review"
            };
            var defect = new Y.Mashups.Story(defectData);
            Y.Assert.areEqual(324298394, defect.ObjectID);
            Y.Assert.areEqual("DE898", defect.FormattedID);
            Y.Assert.areEqual("CRD CBG00130781: [eng] Infinite loop if swg_merge.ds is hard_readonly", defect.Name);
            Y.Assert.areEqual("steve.canavan@ge.com", defect.Owner);
            Y.Assert.areEqual(false, defect.Blocked);
            Y.Assert.areEqual(5.0, defect.PlanEstimate);
            Y.Assert.areEqual(8470.491, defect.Rank);
            Y.Assert.areEqual("In-Progress", defect.ScheduleState);
            Y.Assert.areEqual("In Code Review", defect.KanbanState);
        },

        'should create collection of cards as list': function() {
            var cards = new Y.Mashups.Cards().addCard(new Y.Mashups.Story(Y.Mashups.Tests.Data.StoriesAsData[0]))
                    .addCard(new Y.Mashups.Defect(Y.Mashups.Tests.Data.DefectsAsData[0]));

            Y.Assert.areEqual(2, cards.noOfCards());
        },

        'should be able to sort the defect and story cards based on Rank' : function() {
            var cards = Y.Mashups.Tests.Data.Cards();
            cards.sortByRank();

            Y.Assert.areEqual(321913223, cards.indexOf(0).ObjectID); // first
            Y.Assert.areEqual(325594710, cards.indexOf(1).ObjectID); //second
            Y.Assert.areEqual(324170706, cards.indexOf(9).ObjectID); //last
        },

        'should load cards inside swimlane-cards div': function() {
            var swimlanes = Y.Mashups.Tests.Data.KanbanSwimlanes();
            swimlanes.renderSwimlanes();

            var cards = Y.Mashups.Tests.Data.Cards();
            swimlanes.renderCards(cards);

            Y.Assert.areEqual(1, Y.one("#cards-Defined").all(".card").size());
            Y.Assert.areEqual(2, Y.one("#cards-In-Development").all(".card").size());
        },

        'should add total estimate inside swimlane-header and swimlane-footer': function() {
            var swimlanes = Y.Mashups.Tests.Data.KanbanSwimlanes();
            swimlanes.renderSwimlanes();

            var cards = Y.Mashups.Tests.Data.Cards();
            swimlanes.renderCards(cards);

            Y.Assert.areEqual(4, parseInt(Y.one("#header-Ready-For-Test").one(".estimate").get("innerHTML"), 10));
            Y.Assert.areEqual(4, parseInt(Y.one("#footer-Ready-For-Test").one(".estimate").get("innerHTML"), 10));
        },

        'should create swimlane to keep all card without any swimlane': function() {
            var swimlanes = Y.Mashups.Tests.Data.KanbanSwimlanes();
            swimlanes.renderSwimlanes();

            var cards = Y.Mashups.Tests.Data.Cards();
            swimlanes.renderCards(cards);

            Y.Assert.areEqual(3, Y.one("#cards-Undefined").all(".card").size());
        },

        'should create swimlane based on estimate of the card and palces them inside': function() {
            var swimlanes = Y.Mashups.Tests.Data.EstimateSwimlanes();
            swimlanes.renderSwimlanes();

            var cards = Y.Mashups.Tests.Data.Cards();
            swimlanes.renderCards(cards);

            Y.Assert.areEqual(2, Y.one("#cards-2").all(".card").size());
        },

        'should return required object on findByObjectID': function() {
            var cards = Y.Mashups.Tests.Data.Cards();
            Y.Assert.areEqual(321913223, cards.findByObjectID(321913223).ObjectID);
        },

        'should update owner with name on the card using service call': function() {
            var serviceMock = new Y.Mashups.Stubs.Service();
            serviceMock.findOwnerNameByEmailId = function(card) {
                var tempFunc = function() {
                    card.updateOwnerName("test owner")
                };
                setTimeout(tempFunc, 500);
            };

            var swimlanes = Y.Mashups.Tests.Data.KanbanSwimlanes();
            swimlanes.set('service', serviceMock);
            swimlanes.renderSwimlanes();
            var cards = new Y.Mashups.Cards().addCard(new Y.Mashups.Story(Y.Mashups.Tests.Data.StoriesAsData[0]));
            swimlanes.renderCards(cards);


            this.wait(function() {
                Y.Assert.areEqual("test owner", Y.Cookie.getSub("email-name", "tajuddin.baig@ge.com"));
                var ownerName = Y.one("#card-325594710").one(".owner").get("innerHTML");
                Y.Assert.areEqual("test owner", ownerName)
            }, 1000);

        },

        'should update owner from cookie on the card': function() {
            var serviceMock = new Y.Mashups.Stubs.Service();
            serviceMock.findOwnerNameByEmailId = function(card) {
                var tempFunc = function() {
                    card.updateOwnerName("test owner")
                };
                setTimeout(tempFunc, 500);
            };

            var swimlanes = Y.Mashups.Tests.Data.KanbanSwimlanes();
            swimlanes.set('service', serviceMock);
            swimlanes.renderSwimlanes();
            var cards = new Y.Mashups.Cards().addCard(new Y.Mashups.Story(Y.Mashups.Tests.Data.StoriesAsData[0]));
            swimlanes.renderCards(cards);

            this.wait(function() {
                Y.Assert.areEqual("test owner", Y.Cookie.getSub("email-name", "tajuddin.baig@ge.com"));
                var ownerName = Y.one("#card-325594710").one(".owner").get("innerHTML");
                Y.Assert.areEqual("test owner", ownerName)

                // recreating swimlane and cards so that while rendering card it uses cookie to get owner name
                var swimlanes = Y.Mashups.Tests.Data.KanbanSwimlanes();
                swimlanes.renderSwimlanes();
                var cards = new Y.Mashups.Cards().addCard(new Y.Mashups.Story(Y.Mashups.Tests.Data.StoriesAsData[0]));
                swimlanes.renderCards(cards);
                var ownerName = Y.one("#card-325594710").one(".owner").get("innerHTML");
                Y.Assert.areEqual("test owner", ownerName);

            }, 1000);


        },

        'should get data from swimlanes that needs to be applied to story card while updating': function(){
            var swimlane = new Y.Mashups.Swimlane({ Name: "Defined", data : '{ "KanbanState": "Defined", "ScheduleSate": "Backlog" }' });
            var card = new Y.Mashups.Story(Y.Mashups.Tests.Data.StoriesAsData[0]);
            var serviceMock = new Y.Mashups.Stubs.Service();
            serviceMock.updateCard = function(card, jsonData) {
                Y.Assert.areEqual('{"HierarchicalRequirement": { "KanbanState": "Defined", "ScheduleSate": "Backlog" }}', jsonData );
            };
            card.set('service',serviceMock);

            swimlane.move(card);
        },

        'should get data from swimlanes that needs to be applied to defect card while updating': function(){
            var swimlane = new Y.Mashups.Swimlane({ Name: "Defined", data : '{ "KanbanState": "Defined", "ScheduleSate": "Backlog" }' });
            var card = new Y.Mashups.Defect(Y.Mashups.Tests.Data.DefectsAsData[0]);
            var serviceMock = new Y.Mashups.Stubs.Service();
            serviceMock.updateCard = function(card, jsonData) {
                Y.Assert.areEqual('{"Defect": { "KanbanState": "Defined", "ScheduleSate": "Backlog" }}', jsonData );
            };
            card.set('service',serviceMock);

            swimlane.move(card);
        },

        'should make play area for test as last test': function() {
            var serviceMock = new Y.Mashups.Stubs.Service();
            serviceMock.findOwnerNameByEmailId = function(card) {
                var tempFunc = function() {
                    card.updateOwnerName(card.Owner.substring(0, card.Owner.indexOf(".")))
                };
                setTimeout(tempFunc, 500);
            };


            var swimlanes = Y.Mashups.Tests.Data.KanbanSwimlanes();
            swimlanes.set('service', serviceMock);
            swimlanes.renderSwimlanes();

            var cards = Y.Mashups.Tests.Data.Cards();
            swimlanes.renderCards(cards);
        }
    }

            )
}, '1.0', {requires: ['test','cookie','mashups-card','mashups-global','mashups-swimlane','mashups-test-data']});