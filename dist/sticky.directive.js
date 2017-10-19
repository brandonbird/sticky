'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var utils_1 = require("@ngui/utils");
var NguiStickyDirective = /** @class */ (function () {
    function NguiStickyDirective(el, renderer) {
        var _this = this;
        this.renderer = renderer;
        this.STICKY_CLASSES = {
            STUCK: 'ngui-sticky-stuck',
            UNSTUCK: 'ngui-sticky-unstuck',
            TOP: 'ngui-sticky-top',
            BOTTOM: 'ngui-sticky-bottom',
            FILLER: 'ngui-sticky-filler',
            CONTAINER: 'ngui-sticky-container'
        };
        this.scrollHandler = function () {
            var parentRect = _this.el.parentElement.getBoundingClientRect();
            var bodyRect = document.body.getBoundingClientRect();
            var stickyOffsetTop = _this.stickyAfterElement ? _this.stickyAfterElement.getBoundingClientRect().bottom : 0;
            var dynProps;
            if (_this.original.float === 'right') {
                var right = bodyRect.right - parentRect.right + _this.original.marginRight;
                dynProps = { right: right + 'px' };
            }
            else if (_this.original.float === 'left') {
                var left = parentRect.left - bodyRect.left + _this.original.marginLeft;
                dynProps = { left: left + 'px' };
            }
            else {
                dynProps = { width: parentRect.width + 'px' };
            }
            if (_this.original.marginTop + _this.original.marginBottom +
                _this.original.boundingClientRect.height + stickyOffsetTop >= parentRect.bottom) {
                /**
                 * sticky element reached to the bottom of the container
                 */
                var floatAdjustment = _this.original.float === 'right' ? { right: 0 } :
                    _this.original.float === 'left' ? { left: 0 } : {};
                Object.assign(_this.el.style, {
                    position: 'absolute',
                    float: 'none',
                    top: 'inherit',
                    bottom: 0
                }, dynProps, floatAdjustment);
                _this.renderer.removeClass(_this.el, _this.STICKY_CLASSES.STUCK);
                _this.renderer.removeClass(_this.el, _this.STICKY_CLASSES.TOP);
                _this.renderer.addClass(_this.el, _this.STICKY_CLASSES.UNSTUCK);
                _this.renderer.addClass(_this.el, _this.STICKY_CLASSES.BOTTOM);
            }
            else if (parentRect.top * -1 + _this.original.marginTop + stickyOffsetTop > _this.original.offsetTop) {
                /**
                 * sticky element is in the middle of container
                 */
                // if not floating, add an empty filler element, since the original elements becames 'fixed'
                if (_this.original.float !== 'left' && _this.original.float !== 'right' && !_this.fillerEl) {
                    _this.fillerEl = document.createElement('div');
                    _this.fillerEl.style.height = _this.el.offsetHeight + 'px';
                    _this.renderer.addClass(_this.fillerEl, _this.STICKY_CLASSES.FILLER);
                    _this.parentEl.insertBefore(_this.fillerEl, _this.el);
                }
                Object.assign(_this.el.style, {
                    position: 'fixed',
                    float: 'none',
                    top: stickyOffsetTop + 'px',
                    bottom: 'inherit'
                }, dynProps);
                _this.renderer.removeClass(_this.el, _this.STICKY_CLASSES.UNSTUCK);
                _this.renderer.removeClass(_this.el, _this.STICKY_CLASSES.TOP);
                _this.renderer.removeClass(_this.el, _this.STICKY_CLASSES.BOTTOM);
                _this.renderer.addClass(_this.el, _this.STICKY_CLASSES.STUCK);
            }
            else {
                /**
                 * sticky element is in the original position
                 */
                if (_this.fillerEl) {
                    _this.parentEl.removeChild(_this.fillerEl); //IE11 does not work with el.remove()
                    _this.fillerEl = undefined;
                }
                Object.assign(_this.el.style, {
                    position: _this.original.position,
                    float: _this.original.float,
                    top: _this.original.top,
                    bottom: _this.original.bottom,
                    width: _this.original.width,
                    left: _this.original.left
                }, dynProps);
                _this.renderer.removeClass(_this.el, _this.STICKY_CLASSES.STUCK);
                _this.renderer.removeClass(_this.el, _this.STICKY_CLASSES.BOTTOM);
                _this.renderer.addClass(_this.el, _this.STICKY_CLASSES.UNSTUCK);
                _this.renderer.addClass(_this.el, _this.STICKY_CLASSES.TOP);
            }
        };
        this.el = this.el = el.nativeElement;
        this.parentEl = this.el.parentElement;
    }
    NguiStickyDirective.prototype.ngAfterViewInit = function () {
        this.el.style.boxSizing = 'border-box';
        this.renderer.addClass(this.el, this.STICKY_CLASSES.UNSTUCK);
        this.renderer.addClass(this.el, this.STICKY_CLASSES.TOP);
        this.renderer.addClass(this.parentEl, this.STICKY_CLASSES.CONTAINER);
        if (this.stickyAfter) {
            this.stickyAfterElement = document.querySelector(this.stickyAfter);
        }
        // set the parent relatively positioned
        var allowedPositions = ['absolute', 'fixed', 'relative'];
        var parentElPosition = utils_1.computedStyle(this.parentEl, 'position');
        if (allowedPositions.indexOf(parentElPosition) === -1) {
            this.parentEl.style.position = 'relative';
        }
        this.diff = {
            top: this.el.offsetTop - this.parentEl.offsetTop,
            left: this.el.offsetLeft - this.parentEl.offsetLeft
        };
        var elRect = this.el.getBoundingClientRect();
        this.original = {
            boundingClientRect: elRect,
            position: utils_1.computedStyle(this.el, 'position'),
            float: utils_1.computedStyle(this.el, 'float'),
            top: utils_1.computedStyle(this.el, 'top'),
            bottom: utils_1.computedStyle(this.el, 'bottom'),
            left: utils_1.computedStyle(this.el, 'left'),
            width: utils_1.computedStyle(this.el, 'width'),
            offsetTop: this.el.offsetTop,
            offsetLeft: this.el.offsetLeft,
            marginTop: parseInt(utils_1.computedStyle(this.el, 'marginTop')),
            marginBottom: parseInt(utils_1.computedStyle(this.el, 'marginBottom')),
            marginLeft: parseInt(utils_1.computedStyle(this.el, 'marginLeft')),
            marginRight: parseInt(utils_1.computedStyle(this.el, 'marginLeft'))
        };
        this.attach();
    };
    NguiStickyDirective.prototype.ngOnDestroy = function () {
        this.detach();
    };
    NguiStickyDirective.prototype.attach = function () {
        window.addEventListener('scroll', this.scrollHandler);
        window.addEventListener('resize', this.scrollHandler);
    };
    NguiStickyDirective.prototype.detach = function () {
        window.removeEventListener('scroll', this.scrollHandler);
        window.removeEventListener('resize', this.scrollHandler);
    };
    NguiStickyDirective.decorators = [
        { type: core_1.Directive, args: [{
                    selector: '[ngui-sticky]'
                },] },
    ];
    /** @nocollapse */
    NguiStickyDirective.ctorParameters = function () { return [
        { type: core_1.ElementRef, },
        { type: core_1.Renderer2, },
    ]; };
    NguiStickyDirective.propDecorators = {
        'stickyAfter': [{ type: core_1.Input, args: ['sticky-after',] },],
    };
    return NguiStickyDirective;
}());
exports.NguiStickyDirective = NguiStickyDirective;
//# sourceMappingURL=sticky.directive.js.map