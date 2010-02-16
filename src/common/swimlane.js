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
        },

        htmlID: function() {
            return Y.Mashups.htmlID(this.Name);
        },

        renderHeaderRow: function() {
            var swimlaneNode = Y.Node.create("<div></div>");
            swimlaneNode.addClass("swimlane");

            var swimlaneName = Y.Node.create("<div></div>");
            swimlaneName.addClass("name");
            swimlaneName.set("innerHTML", this.Name);
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
            swimlaneNode.setAttribute("id", this.htmlID());
            return swimlaneNode;
        }
    });
    Y.Mashups.Swimlane = Swimlane;

    Y.Mashups.Swimlane.render = function() {
        var swimlaneHeader = Y.one(".swimlane-header");
        var swimlaneCards = Y.one(".swimlane-cards");
        var swimlaneFooter = Y.one(".swimlane-footer");
        Y.each(Y.Mashups.Data.mySwimlanes, function(swimlane, index, array) {
            swimlaneHeader.append(swimlane.renderHeaderRow());
            swimlaneCards.append(swimlane.renderCardsRow());
            swimlaneFooter.append(swimlane.renderHeaderRow());
        });
    }

}, '1.0', {requires: ['base','node','io','json','dd','cookie','mashups-global']});