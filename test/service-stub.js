YUI.add('mashup-stubs', function(Y) {
    Y.namespace('Mashups.Stubs');

    function Service(data) {
        Service.superclass.constructor.apply(this, arguments);
    }

    Service.NAME = 'service';
    Service.ATTRS = {};

    Y.extend(Service, Y.Base, {
        findOwnerNameByEmailId : function(obj) {
            //don't care updating owner name
            return;
        }

    });

    Y.Mashups.Stubs.Service = Service;


},'0.6', {requires: ['base']});