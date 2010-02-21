YUI.add('mashups-action-menu', function(Y) {
    Y.namespace('Mashups');

    function ActionMenu(config) {
        ActionMenu.superclass.constructor.apply(this, arguments);
    }

    ActionMenu.NAME = 'action-menu';
    ActionMenu.ATTRS = { id: { value: "action-menu"}, showSwimlane: {value: true}, hideSwimlane: {value: true} };

    Y.extend(ActionMenu, Y.Base, {
        initializer: function(config) {
        },

        buildMenu: function(swimlanes) {
            this.clear();
            var mainMenuNode = Y.Node.create("<ul></ul>");
            this.buildShowSwimlaneActionMenu(swimlanes, mainMenuNode);
            this.buildHideSwimlaneActionMenu(swimlanes, mainMenuNode);

            var menuContent = Y.one(".yui-menu-content");
            menuContent.appendChild(mainMenuNode);
            
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

}, '1.0', {requires: ['base','node-menunav']});