YUI.add('mashups-global',function(Y){
    Y.namespace('Mashups.Constants');

    Y.Mashups.Constants.CARD_NAME_LENGTH = 70;
    Y.Mashups.Constants.BaseUrl = "/";

    Y.namespace('Mashups.Data');
    Y.Mashups.Data.mySwimlanes = null;

    Y.Mashups.cleanSwimlaneBoard = function() {
        Y.Mashups.Data.mySwimlanes = null;
        Y.one(".swimlane-header").set("innerHTML","");
        Y.one(".swimlane-cards").set("innerHTML","");
        Y.one(".swimlane-footer").set("innerHTML","");
    };

    Y.Mashups.htmlID = function(value) {
        return value.replace(/ /g, '-');
    };

},'0.6',{requires: ['base']});