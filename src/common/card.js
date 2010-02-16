YUI.add('mashups-card', function(Y) {
    Y.namespace('Mashups');

    function Card(data) {
        Card.superclass.constructor.apply(this, arguments);
    }

    Card.NAME = 'card';
    Card.ATTRS = {};

    Y.extend(Card, Y.Base, {
        initializer: function(data) {
            var self = this;
            Y.each(data, function(value, index, array) {
                self[index] = value;
            });
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
    Story.ATTRS = {};
    Y.extend(Story, Y.Mashups.Card, {

    });

    // Defect
    function Defect(data) {
        Defect.superclass.constructor.apply(this, arguments);
    }

    Defect.NAME = 'defect';
    Defect.ATTRS = {};
    Y.extend(Defect, Y.Mashups.Card, {

    });


    Y.Mashups.Story = Story;
    Y.Mashups.Defect = Defect;

}, '1.0', {requires: ['base','node','io','json','dd','cookie']});