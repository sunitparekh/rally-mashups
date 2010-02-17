YUI.add('mashups-swimlane', function(Y) {
    Y.namespace('Mashups');

    function Swimlane(data) {
        Swimlane.superclass.constructor.apply(this, arguments);
    }

    Swimlane.NAME = 'swimlane';
    Swimlane.ATTRS = {};

    Y.extend(Swimlane, Y.Base, {
        initializer: function(data) {
            var self = this;
            Y.each(data, function(value, index, array) {
                self[index] = value;
            });
            if (this.Label == null) this.Label = this.Name;
        },

        htmlID: function() {
            return this.Name.htmlID();
        },

        renderHeaderRow: function(prefix, swimlaneNotAvailableFlag) {
            var swimlaneNode = Y.Node.create("<div></div>");
            swimlaneNode.addClass("swimlane");
            if (swimlaneNotAvailableFlag) swimlaneNode.addClass("swimlane-not-available");
            swimlaneNode.setAttribute("id", prefix + "-" + this.htmlID());
            var swimlaneName = Y.Node.create("<div></div>");
            swimlaneName.addClass("name");
            swimlaneName.set("innerHTML", this.Label);
            swimlaneNode.appendChild(swimlaneName);

            var swimlaneTotalEstimate = Y.Node.create("<div></div>");
            swimlaneTotalEstimate.addClass("estimate");
            swimlaneTotalEstimate.set("innerHTML", 0);
            swimlaneNode.appendChild(swimlaneTotalEstimate);
            return swimlaneNode;
        },

        renderCardsRow: function() {
            var swimlaneNode = Y.Node.create("<div></div>");
            swimlaneNode.addClass("swimlane");
            swimlaneNode.setAttribute("id", "cards-" + this.htmlID());
            return swimlaneNode;
        },

        move: function(card) {
            alert("Moving card " + card.FormattedID + " to swimlane " + this.Name);
        }
    });
    Y.Mashups.Swimlane = Swimlane;

    // Collection
    function Swimlanes(config) {
        Swimlanes.superclass.constructor.apply(this, arguments);
    }

    Swimlanes.NAME = 'swimlanes';
    Swimlanes.ATTRS = { swimlaneNotAvailable : { value : new Y.Mashups.Swimlane({ Name: "Undefined"}) }, swimlaneKey: { value: 'KanbanState'}};

    Y.extend(Swimlanes, Y.Base, {
        initializer: function(config) {
            this.cards = new Y.Mashups.Cards();
        },

        addSwimlane: function(swimlane) {
            if (this.swimlanes == null) this.swimlanes = new Array(this.get('swimlaneNotAvailable'));
            this.swimlanes = this.swimlanes.concat(swimlane);
            return this;
        },

        noOfSwimlanes: function() {
            return this.swimlanes.length;
        },

        findByName: function(swimlaneName, returnThisIfNotFound) {
            var swimlaneFound = Y.Array.find(this.swimlanes, function(swimlane) {
                return (swimlane.Name == swimlaneName);
            });
            if (swimlaneFound == null) {
                if (returnThisIfNotFound === undefined) returnThisIfNotFound = this.get("swimlaneNotAvailable");
                swimlaneFound = returnThisIfNotFound;
            }
            return swimlaneFound;
        },

        findByHtmlID: function(htmlID) {
            return Y.Array.find(this.swimlanes, function(swimlane) {
                return (swimlane.htmlID() == htmlID);
            });
        },

        findCardByObjectID: function(cardObjectID) {
            return this.cards.findByObjectID(cardObjectID);
        },

        indexOf: function(index) {
            return this.swimlanes[index];
        },

        render: function() {
            this.clearSwimlanes();
            var swimlaneHeader = Y.one(".swimlane-header");
            var swimlaneCards = Y.one(".swimlane-cards");
            var swimlaneFooter = Y.one(".swimlane-footer");
            var self = this;
            Y.each(this.swimlanes, function(swimlane, index, array) {
                var swimlaneNotAvailableFlag = (swimlane === self.get("swimlaneNotAvailable"));

                swimlaneHeader.append(swimlane.renderHeaderRow("header", swimlaneNotAvailableFlag));

                var cardsRowNode = swimlane.renderCardsRow();
                cardsRowNode.plug(Y.Plugin.Drop);
                cardsRowNode.drop.on('drop:hit', function(element) {
                    var swimlane = self.findByHtmlID(element.drop.get('node').getAttribute("id").substring("cards-".length));
                    var card = self.findCardByObjectID(element.drag.get('node').getAttribute("id"));
                    swimlane.move(card);
                });
                swimlaneCards.append(cardsRowNode);

                swimlaneFooter.append(swimlane.renderHeaderRow("footer", swimlaneNotAvailableFlag));
            });
        },

        clearSwimlanes : function() {
            Y.one(".swimlane-header").set("innerHTML", "");
            Y.one(".swimlane-footer").set("innerHTML", "");
            Y.one(".swimlane-cards").set("innerHTML", "");
        },

        clearCards : function() {
            Y.each(this.swimlanes, function(swimlane, index, array) {
                var swimlaneCards = Y.one("#cards-" + swimlane.htmlID());
                swimlaneCards.set("innerHTML", "");
            });
        },

        renderCard : function(card) {
            var swimlaneKey = this.get('swimlaneKey');
            var swimlane = this.findByName(card[swimlaneKey]);
            this.cards.addCard(card);
            var swimlaneCardsNode = Y.one("#cards-" + swimlane.htmlID());

            var cardNode = card.render();
            cardNode.plug(Y.Plugin.Drag);
            swimlaneCardsNode.append(cardNode);

            this.updateEstimate(card[swimlaneKey], card.PlanEstimate, "header");
            this.updateEstimate(card[swimlaneKey], card.PlanEstimate, "footer");
        },

        renderCards : function (cards) {
            this.clearCards();
            var self = this;
            Y.each(cards.cards, function(card) {
                self.renderCard(card);
            });
        },

        updateEstimate : function(swimlaneName, estimate, prefix) {
            if (estimate == null || estimate == 0 || estimate == 0.0) return;
            var swimlaneNode = Y.one("#" + prefix + "-" + this.findByName(swimlaneName).htmlID());
            var estimateNode = swimlaneNode.one(".estimate");
            var total = parseFloat(estimateNode.get("innerHTML")) + estimate;
            estimateNode.set("innerHTML", total);
        }
    });
    Y.Mashups.Swimlanes = Swimlanes;


}, '1.0', {requires: ['base','node','io','json','dd','cookie','collection','mashups-global']});