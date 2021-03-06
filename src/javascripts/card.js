YUI.add('mashups-card', function(Y) {
    Y.namespace('Mashups');

    function Card(data) {
        Card.superclass.constructor.apply(this, arguments);
    }

    Card.NAME = 'card';
    Card.ATTRS = {
        type: { value: "card"},
        service: {value : null }
    };

    Y.extend(Card, Y.Base, {
        initializer: function(data) {
            var self = this;
            Y.each(data, function(value, index, array) {
                self[index] = value;
            });
        },

        cardID: function() {
            return "card-" + this.ObjectID;
        },

        render: function() {
            var cardNode = Y.Node.create("<div></div>");
            cardNode.addClass("card");
            cardNode.addClass(this.get('type'));
            cardNode.setAttribute("id", this.cardID());
                var headerNode = Y.Node.create("<div></div>");
                headerNode.addClass("header");
                    var number = Y.Node.create("<div></div>");
                    number.addClass("number");
                    number.setContent(this.FormattedID);
                    number.on("click", function(e,card){card.editCard();} ,{},this);
                headerNode.appendChild(number);
                    var estimate = Y.Node.create("<div></div>");
                    estimate.addClass("estimate");
                    estimate.setContent(this.estimate());
                headerNode.appendChild(estimate);
                    var state = Y.Node.create("<div></div>");
                    state.addClass("state");
                    state.addClass('blocked-' + this.Blocked);
                    state.setContent(this.scheduleStateLegend());
                headerNode.appendChild(state);
            cardNode.appendChild(headerNode);
                var titleNode = Y.Node.create("<div></div>");
                titleNode.addClass("title");
                titleNode.setAttribute("title","click to toggle card selection");
                titleNode.setContent(this.truncatedName());
                titleNode.on("click", function(e,card){card.toggleSelection();} ,{},this);
            cardNode.appendChild(titleNode);
                var footerNode = Y.Node.create("<div></div>");
                footerNode.addClass("footer");
                    var owner = Y.Node.create("<div></div>");
                    owner.addClass("owner");
                    owner.setContent(this.ownerName());
                footerNode.appendChild(owner);
            cardNode.appendChild(footerNode);
            return cardNode;
        },

        editCard: function(){
            var url = '/slm/awp/edit.sp?oid=' + this.ObjectID +  '&typeDefName=' + this.get('editCardRallyType');
            window.popup(url, 800, 600, 'littleN');
            return false;
        },

        toggleSelection: function() {
            Y.one("#" + this.cardID()).one(".title").toggleClass("selected");
        },

        truncatedName: function() {
            if (this.Name.length <= Y.Mashups.Constants.CARD_NAME_LENGTH) return this.Name;
            return this.Name.substring(0, Y.Mashups.Constants.CARD_NAME_LENGTH) + '...';
        },

        ownerName: function() {
            if (this.Owner == null || this.Owner == "") return "&nbsp;";
            var ownerName = Y.Cookie.getSub("email-name",this.Owner);
            if (ownerName != null) return ownerName;
            this.get('service').findOwnerNameByEmailId(this);
            return this.Owner;
        },

        updateOwnerName: function(ownerName) {
            Y.Cookie.setSub("email-name",this.Owner, ownerName, { expires: new Date("January 12, 2025") });
            Y.one("#" + this.cardID()).one(".owner").setContent(ownerName);
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
        },

        update: function(data, callback) {
            var jsonData = '{"' + this.get('rallyType') + '": ' + data + "}";
            this.get('service').updateCard(this, jsonData, callback);
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
    Story.ATTRS = { type: { value: "story"}, rallyType: { value: "HierarchicalRequirement"}, editCardRallyType: { value: "Hierarchical Requirement"}};
    Y.extend(Story, Y.Mashups.Card, {

    });

    // Defect
    function Defect(data) {
        Defect.superclass.constructor.apply(this, arguments);
    }

    Defect.NAME = 'defect';
    Defect.ATTRS = { type: { value: "defect"}, rallyType: { value: "Defect"}, editCardRallyType: { value: "Defect"}};
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
            if (this.cards == null) return 0;
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

}, '1.0', {requires: ['base','node','io','json','dd','cookie','collection','mashups-global','mashups-service']});