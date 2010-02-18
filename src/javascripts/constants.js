YUI.add('mashups-global',function(Y){
    Y.namespace('Mashups.Constants');

    Y.Mashups.Constants.CARD_NAME_LENGTH = 70;
    Y.Mashups.Constants.BaseUrl = "/";

    Y.namespace('Mashups.Data');

    String.prototype.htmlID = function() {
        return this.replace(/ /g, '-').replace(/\./g,"-");
    };

},'0.6',{requires: ['base']});