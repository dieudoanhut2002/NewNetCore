
(function (define) {
    define(function (require) {
        var HiloMenuContext = {
            contextMenu: null,
            window: $(window),
            init: function () {
                HiloMenuContext.contextMenu = $("body div.context-menu");
                if (HiloMenuContext.contextMenu.length == 0) {
                    HiloMenuContext.contextMenu = $("<div>")
                        .addClass("context-menu")
                        .addClass("border")
                        .addClass("hbd")
                        .addClass("rounded");
                    $("body").append(HiloMenuContext.contextMenu);
                    $(document).on("mousedown", function (e) {
                        var target = $(e.target);
                        if (!target.is(HiloMenuContext.contextMenu) && !target.closest(HiloMenuContext.contextMenu).length) {
                            HiloMenuContext.hide();
                        }
                    });
                    /*$(document).on("contextmenu", function (e) {
                        var target = $(e.target);
                        if (target.is(HiloMenuContext.contextMenu) && target.closest(HiloMenuContext.contextMenu).length) {
                            e.preventDefault();
                            e.stopPropagation();
                            e.stopImmediatePropagation();
                        }
                        console.log(e);
                    });*/
                    $(document).on("scroll", function (e) {
                        if (HiloMenuContext.contextMenu.hasClass("active")) {
                            HiloMenuContext.hide();
                        }
                    });
                }
                else
                    HiloMenuContext.clear();

                $(document).find("table.show-menu-context tr").off("contextmenu").on("contextmenu", function (e) {

                    var $this = $(this);
                    var $a = $this.find("td:last-child a:visible");
                    if ($a.length > 0)
                    {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        HiloMenuContext.clear();
                        $a.each((i, item) => {
                            var $item = $(item);
                            HiloMenuContext.addItem(`<div class='item'>${$item.html()}${$item.attr("title")} </div>`).on("click", function (e) {
                                $item[0].click();
                            })
                        })

                        HiloMenuContext.showMenu(e);

                    }
                })

                return HiloMenuContext;
            },
            addItem: function (item) {
                var $item = $(item);
                HiloMenuContext.contextMenu.append($item);
                $item.on("click", function (e) {
                    HiloMenuContext.hide();
                })
                return $item;
            },
            hide() {
                HiloMenuContext.contextMenu.removeClass("active")
            },
            show() {
                HiloMenuContext.contextMenu.addClass("active")
            },
            clear: function () {
                HiloMenuContext.contextMenu.empty();
            },
            showMenu: function (e) {

                let mouseX = e.clientX || e.touches[0].clientX;
                let mouseY = e.clientY || e.touches[0].clientY;
                let menuHeight = HiloMenuContext.contextMenu.outerHeight();
                let menuWidth = HiloMenuContext.contextMenu.outerWidth();
                let width = HiloMenuContext.window.width();
                let height = HiloMenuContext.window.height();
                var top = mouseY;
                var left = mouseX;
                if (width - mouseX < menuWidth) {
                    left = width - menuWidth - 2;
                }
                if (height - mouseY < menuHeight) {
                    top = height - menuHeight - 2;
                }
                HiloMenuContext.contextMenu.css({
                    top: top,
                    left: left,
                });
                HiloMenuContext.show();
            }
        }
        return HiloMenuContext.init();
    });
})(typeof define === 'function' && define.amd ? define : function (factory) {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(require('jquery'));
    } else {
        window.HiloMenuContext = factory(window.jQuery);
    }
});