YUI.add('mashup-service', function(Y) {
    Y.namespace('Mashups');

    function Service(data) {
        Service.superclass.constructor.apply(this, arguments);
    }

    Service.NAME = 'service';
    Service.ATTRS = {};

    Y.extend(Service, Y.Base, {
        initialiser : function(config) {
            Y.io.header('Content-Type', 'application/json');
        },
        execute : function(url, config) {
            Y.io.execute(url, config);
        },

        findOwnerNameByEmailId : function(card) {
            var url = '/slm/webservice/1.14/user.js?query=(EmailAddress = ' + card.Owner + ' )';
            var config = {
                method: 'GET',
                on: {
                    success: function (x, o, card) {
                        var ownerName = null;
                        var response = Y.JSON.parse(o.responseText);
                        var ownerObject = response['QueryResult']['Results'][0];
                        if (ownerObject != null) {
                            ownerName = ownerObject['_refObjectName'];
                        }
                        card.updateOwnerName(ownerName);
                    }
                },
                arguments: card
            };

            this.execute(url, config);
        }

    });

    Y.Mashups.Service = Service;


},'0.6', {requires: ['base','io']});