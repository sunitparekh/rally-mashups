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
            this.estimate = 0.0;
        },

        htmlID: function() {
            return this.Name.htmlID();
        },

        headerID: function() {
            return "header-" + this.htmlID();
        },

        footerID: function() {
            return "footer-" + this.htmlID();
        },

        cardsID: function() {
            return "cards-" + this.htmlID();
        },

        renderHeaderRow: function(id, swimlaneNotAvailableFlag) {
            var swimlaneNode = Y.Node.create("<div></div>");
            swimlaneNode.addClass("swimlane");
            if (swimlaneNotAvailableFlag) swimlaneNode.addClass("swimlane-not-available");
            swimlaneNode.setAttribute("id", id);
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
            swimlaneNode.setAttribute("id", this.cardsID());
            return swimlaneNode;
        },

        move: function(card) {
            Y.Mashups.FlashMessage.message.show("Please wait.. moving card '" + card.FormattedID + "' to swimlane '" + this.Label + "'");
            card.update(this.data);
        },

        show: function() {
            Y.one("#" + this.headerID()).removeClass("hide");
            Y.one("#" + this.cardsID()).removeClass("hide");
            Y.one("#" + this.footerID()).removeClass("hide");
            Y.Cookie.removeSub(this.get("service").get("mashupName") + ".swimlanes",this.Name, { removeIfEmpty: true });
        },

        hide: function() {
            Y.one("#" + this.headerID()).addClass("hide");
            Y.one("#" + this.cardsID()).addClass("hide");
            Y.one("#" + this.footerID()).addClass("hide");
            Y.Cookie.setSub(this.get("service").get("mashupName") + ".swimlanes",this.Name,"hide", { expires: new Date("January 12, 2025") });
        },

        isHidden: function() {
            return (Y.Cookie.getSub(this.get("service").get("mashupName") + ".swimlanes",this.Name) == "hide");
        }
    });
    Y.Mashups.Swimlane = Swimlane;

    // Collection
    function Swimlanes(config) {
        Swimlanes.superclass.constructor.apply(this, arguments);
    }

    Swimlanes.NAME = 'swimlanes';
    Swimlanes.ATTRS = {
        swimlaneNotAvailable : { value : new Y.Mashups.Swimlane({ Name: "Undefined"}) },
        swimlaneKey: { value: 'KanbanState'},
        service: { value : null }
    };

    Y.extend(Swimlanes, Y.Base, {
        initializer: function(config) {
            this.cards = new Y.Mashups.Cards();
        },

        swimlaneKeyValue: function(card) {
            var keyParts = this.get("swimlaneKey").split(".");
            var keyValue = card;
            Y.each(keyParts, function(keyPart) {
                if (keyValue == null) return;
                keyValue = keyValue[keyPart];
            });
            return keyValue;
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

        renderSwimlanes: function() {
            this.clearSwimlanes();
            var swimlaneHeader = Y.one(".swimlane-header");
            var swimlaneCards = Y.one(".swimlane-cards");
            var swimlaneFooter = Y.one(".swimlane-footer");
            var self = this;
            Y.each(this.swimlanes, function(swimlane) {
                swimlane.set('service',self.get("service"));
                var swimlaneNotAvailableFlag = (swimlane === self.get("swimlaneNotAvailable"));

                swimlaneHeader.append(swimlane.renderHeaderRow(swimlane.headerID(), swimlaneNotAvailableFlag));

                var cardsRowNode = swimlane.renderCardsRow();
                if (swimlane != self.get('swimlaneNotAvailable')) {
                    cardsRowNode.plug(Y.Plugin.Drop);
                    cardsRowNode.drop.on('drop:hit', function(element) {
                        var newSwimlane = self.findByHtmlID(element.drop.get('node').getAttribute("id").substring("cards-".length));
                        var card = self.findCardByObjectID(element.drag.get('node').getAttribute("id").substring("card-".length));
                        if (newSwimlane.Name == self.swimlaneKeyValue(card)) { Y.Mashups.FlashMessage.message.show('Card moved into same swimlane. No updates.'); return; }
                        newSwimlane.move(card);
                    });
                }
                swimlaneCards.append(cardsRowNode);

                swimlaneFooter.append(swimlane.renderHeaderRow(swimlane.footerID(), swimlaneNotAvailableFlag));
            });
        },

        clearSwimlanes : function() {
            Y.one(".swimlane-header").set("innerHTML", "");
            Y.one(".swimlane-footer").set("innerHTML", "");
            Y.one(".swimlane-cards").set("innerHTML", "");
        },

        clearCards : function() {
            var self = this;
            this.cards = new Y.Mashups.Cards();
            Y.each(this.swimlanes, function(swimlane) {
                Y.one("#" + swimlane.cardsID()).set("innerHTML", "");
                swimlane.estimate = 0.0;
                self.updateEstimate(swimlane, 0.0);
            });
        },

        renderCard : function(card) {
            var keyValue = this.swimlaneKeyValue(card);
            var swimlane = this.findByName(keyValue);
            this.cards.addCard(card);
            var swimlaneCardsNode = Y.one("#" + swimlane.cardsID());

            var cardNode = card.render();
            cardNode.plug(Y.Plugin.Drag);
            swimlaneCardsNode.append(cardNode);

            this.updateEstimate(swimlane, card.PlanEstimate);
        },

        renderCards : function (cards) {
            this.clearCards();
            var self = this;
            Y.each(cards.cards, function(card) {
                card.set('service', self.get('service'));
                self.renderCard(card);
            });
            Y.Mashups.FlashMessage.message.hide();
        },

        updateEstimate : function(swimlane, estimate) {
            if (estimate == null || estimate == undefined) return;
            swimlane.estimate = swimlane.estimate + estimate;
            Y.one("#" + swimlane.headerID()).one(".estimate").set("innerHTML", swimlane.estimate);
            Y.one("#" + swimlane.footerID()).one(".estimate").set("innerHTML", swimlane.estimate);
        }
    });
    Y.Mashups.Swimlanes = Swimlanes;


}, '1.0', {requires: ['base','node','io','json','dd','cookie','collection','mashups-global','mashups-service']});