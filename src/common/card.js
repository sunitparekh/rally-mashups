YUI.add('mashups-card',function(Y){
    Y.namespace('Mashups');

    function Card(config){
        Card.superclass.constructor.apply(this, arguments);
    }

    Card.NAME = 'card';
    Card.ATTRS = {};

    Y.extend(Card,Y.Base,{
        initializer : function(cfg){ },
        destructor : function() {}    
    });
    Y.Mashups.Card = Card;


    function Story() {
        this._initStory();
    }
    Story.NAME = 'story';
    Story.ATTRS = {};
    Y.extend(Story, Y.Mashups.Card, {
        _initStory : function() {}
    });


    function Defect() {
        this._initDefect();
    }
    Defect.NAME = 'defect';
    Defect.ATTRS = {};
    Y.extend(Defect, Y.Mashups.Card, {
        _initDefect : function() {}
    });



    Y.Mashups.Story = Story;
    Y.Mashups.Defect = Defect;

},'0.6',{requires: ['base','node','io','json','dd','cookie']});