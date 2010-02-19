YUI.add('mashups-global',function(Y){
    Y.namespace('Mashups.Constants');

    Y.Mashups.Constants.CARD_NAME_LENGTH = 70;
    Y.Mashups.Constants.BaseUrl = "/";

    Y.namespace('Mashups.Data');

    String.prototype.htmlID = function() {
        return this.replace(/ /g, '-').replace(/\./g,"-");
    };

    Y.namespace('Mashups');

    function FlashMessage(data) {
        FlashMessage.superclass.constructor.apply(this, arguments);
    }

    FlashMessage.NAME = 'FlashMessage';
    FlashMessage.ATTRS = { id: { value: "flash-message"} };

    Y.extend(FlashMessage, Y.Base, {
        show: function(message) {
            var flashMessage = Y.one("#" + this.get('id'));
            if (flashMessage == null || flashMessage == undefined) return;
            flashMessage.set("innerHTML",message);
            flashMessage.removeClass("hide");
        },

        hide: function() {
            var flashMessage = Y.one("#" + this.get('id'));
            if (flashMessage == null || flashMessage == undefined) return;
            flashMessage.set("innerHTML","");
            flashMessage.addClass("hide");
        }
    });

    Y.Mashups.FlashMessage = FlashMessage;

    Y.Mashups.FlashMessage.message = new Y.Mashups.FlashMessage();
    Y.Mashups.FlashMessage.error = new Y.Mashups.FlashMessage({ id: "error-message"});

},'0.6',{requires: ['base']});