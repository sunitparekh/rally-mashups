YUI.add('mashups-card', function(Y) {
    Y.namespace('Mashups');

    function Card(data) {
        Card.superclass.constructor.apply(this, arguments);
    }

    Card.NAME = 'card';
    Card.ATTRS = { type: { value: "card"}};

    Y.extend(Card, Y.Base, {
        initializer: function(data) {
            var self = this;
            Y.each(data, function(value, index, array) {
                self[index] = value;
            });
        },

        render: function() {
            var card = Y.Node.create("<div></div>");
            card.addClass("card");
            card.addClass(this.get('type'));
            card.setAttribute("id", this.ObjectID);
            var header = Y.Node.create("<div></div>");
            header.addClass("header");
            var number = Y.Node.create("<div></div>");
            number.addClass("number");
            number.setContent(this.FormattedID);
            header.appendChild(number);
            var estimate = Y.Node.create("<div></div>");
            estimate.addClass("estimate");
            estimate.setContent(this.estimate());
            header.appendChild(estimate);
            var state = Y.Node.create("<div></div>");
            state.addClass("state");
            state.addClass('blocked-' + this.Blocked);
            state.setContent(this.scheduleStateLegend());
            header.appendChild(state);
            card.appendChild(header);
            var title = Y.Node.create("<div></div>");
            title.addClass("title");
            title.setContent(this.truncatedName());
            card.appendChild(title);
            var footer = Y.Node.create("<div></div>");
            footer.addClass("footer");
            var owner = Y.Node.create("<div></div>");
            owner.addClass("owner");
            owner.setContent(this.ownerName());
            footer.appendChild(owner);
            card.appendChild(footer);
            return card;
        },

        truncatedName: function() {
            if (this.Name.length <= Y.Mashups.Constants.CARD_NAME_LENGTH) return this.Name;
            return this.Name.substring(0, Y.Mashups.Constants.CARD_NAME_LENGTH) + '...';
        },

        ownerName: function() {
            if (this.Owner == null) return "&nbsp;";
            return this.Owner;
        },

        estimate: function() {
            if (this.PlanEstimate == null) return "&nbsp;";
            return this.PlanEstimate;
        },

        scheduleStateLegend: function() {
            switch (this.ScheduleState) {
                case 'Backlog': return 'B';
                case 'Defined': return 'D';
                case 'In-Progress': return 'P';
                case 'Completed': return 'C';
                case 'Accepted': return 'A';
            }
        }
    });
    Y.Mashups.Card = Card;
    Y.Mashups.Card.sortByRank = function (a, b) {
        return (a.Rank - b.Rank);
    };

    // Story
    function Story(data) {
        Story.superclass.constructor.apply(this, arguments);
    }

    Story.NAME = 'story';
    Story.ATTRS = { type: { value: "story"}};
    Y.extend(Story, Y.Mashups.Card, {

    });

    // Defect
    function Defect(data) {
        Defect.superclass.constructor.apply(this, arguments);
    }

    Defect.NAME = 'defect';
    Defect.ATTRS = { type: { value: "defect"}};
    Y.extend(Defect, Y.Mashups.Card, {

    });


    Y.Mashups.Story = Story;
    Y.Mashups.Defect = Defect;

    // Collection
    function Cards(config) {
        Cards.superclass.constructor.apply(this, arguments);
    }

    Cards.NAME = 'cards';
    Cards.ATTRS = {};

    Y.extend(Cards, Y.Base, {
        addCard: function(card) {
            if (this.cards == null) this.cards = new Array();
            this.cards = this.cards.concat(card);
            return this;
        },

        findByObjectID : function(cardObjectID) {
            if (this.cards == null) return;
            return Y.Array.find(this.cards, function(card) {
                return (card.ObjectID == cardObjectID);
            });
        },
        noOfCards: function() {
            return this.cards.length;
        },

        sortByRank: function() {
            this.cards.sort(Y.Mashups.Card.sortByRank);
        },

        indexOf: function(index) {
            return this.cards[index];
        }
    });
    Y.Mashups.Cards = Cards;

}, '1.0', {requires: ['base','node','io','json','dd','cookie','collection','mashups-global']});