/*!
 * jQuery shTooltip plugin v1.0
 * 2014-01-23
 *
 * Copyright (c) 2010-2014 Pavel Tzonkov <sunhater@sunhater.com>
 * Dual licensed under the MIT and GPL licenses.
 */

(function($) {
    $.fn.shTooltip = function(settings) {

        var c = {
            namespace: "shtt",
            position: {
                left: 15,
                top: 20,
                vertical: "bottom",
                horizontal: "right"
            },
            align: false,
            snap: true,
            css: false,
            content: false,
            contentNext: false,
            eventOpen: "mouseenter",
            eventClose: "mouseleave",

            fade: "fast"
        },

        defaultClass = "shtt-default",
        defaultCSS = {
            position: "absolute",
            display: "none",
            background: "#ffb",
            border: "1px solid #885",
            padding: "2px 3px",
            color: "#555",
            'border-radius': "3px"
        },

        testTip = "jQuery shTooltip plugin",

        close = function(el) {
            var tip = el.data('tip');
            if (tip) {
                el.data('tip', false);
                tip.fadeOut(c.fade, function() {
                    tip.detach();
                });
            }
            return false;
        },

        snap = function(el, left, top) {
            var x = $(window).scrollLeft();
            var y = $(window).scrollTop();
            var width = el.outerWidth(true);
            var height = el.outerHeight(true);

            if ((width <= $(window).width()) && (height <= $(window).height())) {
                if (left < x)
                    left = x;
                else if ((left + width) > (x + $(window).width()))
                    left = $(window).width() + x - width;

                if (top < y)
                    top = y;
                else if ((top + height) > (y + $(window).height()))
                    top = $(window).height() + y - height;
            }

            el.css({
                left: left + "px",
                top: top + "px"
            });
        };

        if ((typeof settings != 'undefined') && settings.substr)
            c.content = settings;
        else
            $.extend(c, settings);

        if (!$('#' + defaultClass).get(0)) {
            var style = '<style id="' + defaultClass + '" type="text/css">.' + defaultClass + "{";

            $.each(defaultCSS, function(p, v) {
                style += p + ":" + v + ";";
            });

            style += "}</style>";
            $('head').prepend(style);
        }

        this.each(function() {
            var content, e = $(this).first();
            e.unbind(c.eventOpen);
            e.unbind(c.eventClose);

            // GET TIP CONTENT
            if (e.data('content') && e.data('content').length)
                content = e.data('content');
            else if (c.contentNext) {
                content = e.next().html();
                e.next().css('display', "none");
            } else if (c.content !== false)
                content = c.content;
            else if (e.attr('title') && e.attr('title').length)
                content = e.attr('title');
            else
                content = testTip;

            if (e.attr('title')) e.attr('title', "");

            if (!content || !content.length)
                return;
            e.data('content', content);

            e.bind(c.eventOpen, function() {
                var content = $(this).data('content');

                if ((c.eventOpen == c.eventClose) && $(this).data('tip'))
                    return close($(this));

                var tip = $('<div></div>').appendTo('body').addClass(defaultClass).addClass(c.namespace).html(content);

                if (c.css) tip.css(c.css);

                if (c.position.substr) {
                    var top, left;

                    // Default left align for verticaly positioned tips
                    if (/^top|bottom$/.test(c.position) &&
                        !/^left|right|center$/.test(c.align)
                    )
                        c.align = "left";

                    // Default top align for horizontaly positioned tips
                    if (/^left|right$/.test(c.position) &&
                        !/^top|bottom|center$/.test(c.align)
                    )
                        c.align = "top";

                    if (/^top|bottom$/.test(c.position)) {
                        if (c.align == "left")
                            left = $(this).offset().left;
                        else if (c.align == "right")
                            left = $(this).offset().left + $(this).outerWidth(true) - tip.outerWidth(true);
                        else if (c.align == "center")
                            left = $(this).offset().left - parseInt((tip.outerWidth(true) - $(this).outerWidth(true)) / 2);
                    }

                    if (/^left|right$/.test(c.position)) {
                        if (c.align == "top")
                            top = $(this).offset().top;
                        else if (c.align == "bottom")
                            top = $(this).offset().top + $(this).outerHeight(true) - tip.outerHeight(true);
                        else if (c.align == "center")
                            top = $(this).offset().top - parseInt((tip.outerHeight(true) - $(this).outerHeight(true)) / 2);
                    }

                    if (/^top(Left|Right)?$/.test(c.position))
                        top = $(this).offset().top - tip.outerHeight(true);
                    if (/^bottom(Left|Right)?$/.test(c.position))
                        top = $(this).offset().top + $(this).outerHeight(true);
                    if (/^(topL|bottomL|l)eft$/.test(c.position))
                        left = $(this).offset().left - tip.outerWidth(true);
                    if (/^(topR|bottomR|r)ight$/.test(c.position))
                        left = $(this).offset().left + $(this).outerWidth(true);

                    tip.css({
                        left: $(window).scrollLeft() + "px",
                        top: $(window).scrollTop() + "px"
                    });

                    if (c.snap) snap(tip, left, top);
                    tip.fadeIn(c.fade);

                } else if (typeof c.position == "object") {
                    if (!c.position.left) c.position.left = 0;
                    if (!c.position.top) c.position.top = 0;
                    $(this).unbind('mousemove');
                    $(this).bind('mousemove', function(ev) {
                        var left = ev.pageX + c.position.left,
                            top = ev.pageY + c.position.top;
                        if (/^top|center$/.test(c.position.vertical)) {
                            var height = tip.outerHeight(true);
                            if (c.position.vertical == "top")
                                top -= height;
                            else if (c.position.vertical == "center")
                                top -= parseInt(height / 2);
                        }
                        if (/^left|center$/.test(c.position.horizontal)) {
                            var width = tip.outerWidth(true);
                            if (c.position.horizontal == "left")
                                left -= width;
                            else if (c.position.horizontal == "center")
                                left -= parseInt(width / 2);
                        }
                        tip.css({
                            left: $(window).scrollLeft() + "px",
                            top: $(window).scrollTop() + "px"
                        });
                        tip.fadeIn(c.fade);
                        if (c.snap) snap(tip, left, top);
                    });
                }

                $(this).data('tip', tip);
            });

            if (c.eventOpen != c.eventClose) {
                e.bind(c.eventClose, function() {
                    return close($(this));
                });
            }
        });
    };
})(jQuery);
