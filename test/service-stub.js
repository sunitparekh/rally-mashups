YUI.add('mashup-stubs', function(Y) {
    Y.namespace('Mashups.Stubs');

    function Service(data) {
        Service.superclass.constructor.apply(this, arguments);
    }

    Service.NAME = 'service';
    Service.ATTRS = {mashupName: {value: null}};

    Y.extend(Service, Y.Base, {
        // don't care responding stub
        findOwnerNameByEmailId : function(obj) {
            return;
        },

        updateCard : function(card, dataAsJSON) {
            return;
        }

    });

    Y.Mashups.Stubs.Service = Service;


},'0.6', {requires: ['base']});