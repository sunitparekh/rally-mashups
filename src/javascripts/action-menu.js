YUI.add('mashups-action-menu', function(Y) {
    Y.namespace('Mashups');

    function ActionMenu(config) {
        ActionMenu.superclass.constructor.apply(this, arguments);
    }

    ActionMenu.NAME = 'action-menu';
    ActionMenu.ATTRS = { id: { value: "action-menu"}, showSwimlane: {value: true}, hideSwimlane: {value: true}, moveToIteration: {value: true} };

    Y.extend(ActionMenu, Y.Base, {
        initializer: function(config) {
        },

        buildMenu: function(swimlanes, service) {
            this.clear();
            var mainMenuNode = Y.Node.create("<ul></ul>");
            Y.one(".yui-menu-content").appendChild(mainMenuNode);

            this.buildShowSwimlaneActionMenu(swimlanes, mainMenuNode);
            this.buildHideSwimlaneActionMenu(swimlanes, mainMenuNode);

            this.buildMoveToIterationMenu(service, mainMenuNode, swimlanes);
        },

        applyYuiMenu: function() {
            var menu = Y.one("#" + this.get('id'));
            menu.plug(Y.Plugin.NodeMenuNav);
        },

        buildShowSwimlaneActionMenu: function(swimlanes, mainMenuNode) {
            if (this.get("showSwimlane"))
                this.buildSwimlaneActionmenu(swimlanes,mainMenuNode,"Show Swimlane","show-swimlane", function(swimlane) {swimlane.show();});
        },

        buildHideSwimlaneActionMenu: function(swimlanes, mainMenuNode) {
            if (this.get("hideSwimlane"))
                this.buildSwimlaneActionmenu(swimlanes,mainMenuNode,"Hide Swimlane","hide-swimlane", function(swimlane) {swimlane.hide();});
        },

        buildSwimlaneActionmenu: function(swimlanes, mainMenuNode, mainMenuLabel, subMenuId, onclickCallback) {
            var showSwimlaneMainMenuNode = Y.Node.create("<li></li>");
            showSwimlaneMainMenuNode.append("<a class=\"yui-menu-label\" href=\"#" + subMenuId +"\"><em>" + mainMenuLabel + "</em></a>");
                var showSwimlaneSubMenu = Y.Node.create("<div id=\"" + subMenuId +"\" class=\"yui-menu\"></div>");
                    var swimlaneSubMenuContent = Y.Node.create("<div class=\"yui-menu-content\"></div>");
                        var swimlaneSubMenuUl = Y.Node.create("<ul></ul>");
                            Y.each(swimlanes.swimlanes, function(swimlane) {
                                if (swimlane.isHidden()) { swimlane.hide(); }
                                var showSwimlaneLi = Y.Node.create('<li class="yui-menuitem"></li>');
                                    var swimlaneMenuItemAction = Y.Node.create("<a class=\"yui-menuitem-content\" href=\"#\">" + swimlane.Label + "</a>");
                                    swimlaneMenuItemAction.on("click",function() { onclickCallback(swimlane)});
                                    showSwimlaneLi.appendChild(swimlaneMenuItemAction);
                                swimlaneSubMenuUl.appendChild(showSwimlaneLi);
                            });
                        swimlaneSubMenuContent.appendChild(swimlaneSubMenuUl);
                showSwimlaneSubMenu.appendChild(swimlaneSubMenuContent);

                showSwimlaneMainMenuNode.appendChild(showSwimlaneSubMenu);
            mainMenuNode.appendChild(showSwimlaneMainMenuNode);
        },

        buildMoveToIterationMenu: function(service, mainMenuNode, swimlanes) {
            if (!this.get('moveToIteration')) { this.applyYuiMenu(); return; }

            var showSwimlaneMainMenuNode = Y.Node.create("<li></li>");
            showSwimlaneMainMenuNode.append("<a class=\"yui-menu-label\" href=\"#move-to-iteration\"><em>Move to Iteration</em></a>");
                var showSwimlaneSubMenu = Y.Node.create("<div id=\"move-to-iteration\" class=\"yui-menu\"></div>");
                    var swimlaneSubMenuContent = Y.Node.create("<div class=\"yui-menu-content\"></div>");
                        var swimlaneSubMenuUl = Y.Node.create("<ul></ul>");
                        swimlaneSubMenuContent.appendChild(swimlaneSubMenuUl);
                showSwimlaneSubMenu.appendChild(swimlaneSubMenuContent);
                showSwimlaneMainMenuNode.appendChild(showSwimlaneSubMenu);
            mainMenuNode.appendChild(showSwimlaneMainMenuNode);

            var self = this;
            var url = '/slm/webservice/1.14/iteration.js?query=(Project.ObjectID = "' + __PROJECT_OID__ + '")&fetch=true&order=StartDate&start=1&pagesize=100';
            var config = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                on: {
                    success: function (x, o) {
                        var response = Y.JSON.parse(o.responseText);
                        var iterations = response['QueryResult']['Results'];
                        Y.each(iterations, function(iteration){
                            var showSwimlaneLi = Y.Node.create('<li class="yui-menuitem"></li>');
                                var swimlaneMenuItemAction = Y.Node.create("<a class=\"yui-menuitem-content\" href=\"#\">" + iteration.Name + "</a>");
                                swimlaneMenuItemAction.on("click", function(e, iteration) {
                                    var cardNodes = Y.all(".card .selected");
                                    Y.each(cardNodes, function(cardTitleNode, index, array) {
                                        var cardNode = cardTitleNode.ancestor(function(parentNode){return parentNode.hasClass("card");});
                                        Y.Mashups.FlashMessage.message.show("Please wait... moving selected card(s) to iteration '" + iteration.Name + "'.");
                                        var card = swimlanes.findCardByObjectID(cardNode.getAttribute("id").substring("card-".length));
                                        var callback = (index == (array.size() - 1)) ? undefined : function(){};
                                        card.update('{ "Iteration" : ' + iteration.ObjectID +' }', callback);
                                    }, iteration);

                                },{}, iteration);
                                showSwimlaneLi.appendChild(swimlaneMenuItemAction);
                            swimlaneSubMenuUl.appendChild(showSwimlaneLi);
                        });
                        self.applyYuiMenu();
                    }
                }
            };

            service.execute(url, config);
        },

        show: function() {
            var menu = Y.one("#" + this.get('id'));
            if (menu == null || menu == undefined) return;
            menu.removeClass("hide");
        },

        hide: function() {
            var menu = Y.one("#" + this.get('id'));
            if (menu == null || menu == undefined) return;
            menu.addClass("hide");
        },

        clear: function() {
            Y.one(".yui-menu-content").set("innerHTML","");
        }
    });

    Y.Mashups.ActionMenu = ActionMenu;

}, '1.0', {requires: ['base','node','node-menunav']});