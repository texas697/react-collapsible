'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createReactClass = require('create-react-class');

var Collapsible = createReactClass({
  displayName: 'Collapsible',


  //Set validation for prop types
  propTypes: {
    transitionTime: _propTypes2.default.number,
    easing: _propTypes2.default.string,
    open: _propTypes2.default.bool,
    classParentString: _propTypes2.default.string,
    openedClassName: _propTypes2.default.string,
    triggerClassName: _propTypes2.default.string,
    triggerOpenedClassName: _propTypes2.default.string,
    contentOuterClassName: _propTypes2.default.string,
    contentInnerClassName: _propTypes2.default.string,
    accordionPosition: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
    handleTriggerClick: _propTypes2.default.func,
    trigger: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.element]),
    triggerWhenOpen: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.element]),
    triggerDisabled: _propTypes2.default.bool,
    lazyRender: _propTypes2.default.bool,
    overflowWhenOpen: _propTypes2.default.oneOf(['hidden', 'visible', 'auto', 'scroll', 'inherit', 'initial', 'unset']),
    triggerSibling: _propTypes2.default.element
  },

  //If no transition time or easing is passed then default to this
  getDefaultProps: function getDefaultProps() {
    return {
      transitionTime: 400,
      easing: 'linear',
      open: false,
      classParentString: 'Collapsible',
      triggerDisabled: false,
      lazyRender: false,
      overflowWhenOpen: 'hidden',
      openedClassName: '',
      triggerClassName: '',
      triggerOpenedClassName: '',
      contentOuterClassName: '',
      contentInnerClassName: '',
      className: '',
      triggerSibling: null
    };
  },

  //Defaults the dropdown to be closed
  getInitialState: function getInitialState() {

    if (this.props.open) {
      return {
        isClosed: false,
        shouldSwitchAutoOnNextCycle: false,
        height: 'auto',
        transition: 'none',
        hasBeenOpened: true,
        overflow: this.props.overflowWhenOpen
      };
    } else {
      return {
        isClosed: true,
        shouldSwitchAutoOnNextCycle: false,
        height: 0,
        transition: 'height ' + this.props.transitionTime + 'ms ' + this.props.easing,
        hasBeenOpened: false,
        overflow: 'hidden'
      };
    }
  },

  // Taken from https://github.com/EvandroLG/transitionEnd/
  // Determines which prefixed event to listen for
  whichTransitionEnd: function whichTransitionEnd(element) {
    var transitions = {
      'WebkitTransition': 'webkitTransitionEnd',
      'MozTransition': 'transitionend',
      'OTransition': 'oTransitionEnd otransitionend',
      'transition': 'transitionend'
    };

    for (var t in transitions) {
      if (element.style[t] !== undefined) {
        return transitions[t];
      }
    }
  },

  componentDidMount: function componentDidMount() {
    var _this = this;

    //Set up event listener to listen to transitionend so we can switch the height from fixed pixel to auto for much responsiveness;
    //TODO:  Once Synthetic transitionend events have been exposed in the next release of React move this funciton to a function handed to the onTransitionEnd prop

    this.refs.outer.addEventListener(this.whichTransitionEnd(this.refs.outer), function (event) {
      if (_this.state.isClosed === false) {
        _this.setState({
          shouldSwitchAutoOnNextCycle: true
        });
      }
    });
  },

  componentDidUpdate: function componentDidUpdate(prevProps) {

    if (this.state.shouldSwitchAutoOnNextCycle === true && this.state.isClosed === false) {
      //Set the height to auto to make compoenent re-render with the height set to auto.
      //This way the dropdown will be responsive and also change height if there is another dropdown within it.
      this.makeResponsive();
    }

    if (this.state.shouldSwitchAutoOnNextCycle === true && this.state.isClosed === true) {
      this.prepareToOpen();
    }

    //If there has been a change in the open prop (controlled by accordion)
    if (prevProps.open != this.props.open) {
      if (this.props.open === true) {
        this.openCollapsible();
      } else {
        this.closeCollapsible();
      }
    }
  },

  handleTriggerClick: function handleTriggerClick(event) {

    event.preventDefault();

    if (this.props.triggerDisabled) {
      return;
    }

    if (this.props.handleTriggerClick) {
      this.props.handleTriggerClick(this.props.accordionPosition);
    } else {

      if (this.state.isClosed === true) {
        this.openCollapsible();
      } else {
        this.closeCollapsible();
      }
    }
  },

  closeCollapsible: function closeCollapsible() {
    this.setState({
      isClosed: true,
      shouldSwitchAutoOnNextCycle: true,
      height: this.refs.inner.offsetHeight,
      overflow: 'hidden'
    });
  },

  openCollapsible: function openCollapsible() {
    this.setState({
      height: this.refs.inner.offsetHeight,
      transition: 'height ' + this.props.transitionTime + 'ms ' + this.props.easing,
      isClosed: false,
      hasBeenOpened: true
    });
  },

  makeResponsive: function makeResponsive() {
    this.setState({
      height: 'auto',
      transition: 'none',
      shouldSwitchAutoOnNextCycle: false,
      overflow: this.props.overflowWhenOpen
    });
  },

  prepareToOpen: function prepareToOpen() {
    var _this2 = this;

    //The height has been changes back to fixed pixel, we set a small timeout to force the CSS transition back to 0 on the next tick.
    window.setTimeout(function () {
      _this2.setState({
        height: 0,
        shouldSwitchAutoOnNextCycle: false,
        transition: 'height ' + _this2.props.transitionTime + 'ms ' + _this2.props.easing
      });
    }, 50);
  },

  renderNonClickableTriggerElement: function renderNonClickableTriggerElement() {
    if (this.props.triggerSibling) {
      return _react2.default.createElement(
        'span',
        { className: this.props.classParentString + "__trigger-sibling" },
        this.props.triggerSibling
      );
    }

    return null;
  },

  render: function render() {

    var dropdownStyle = {
      height: this.state.height,
      WebkitTransition: this.state.transition,
      msTransition: this.state.transition,
      transition: this.state.transition,
      overflow: this.state.overflow
    };

    var openClass = this.state.isClosed ? 'is-closed' : 'is-open';
    var disabledClass = this.props.triggerDisabled ? 'is-disabled' : '';

    //If user wants different text when tray is open
    var trigger = this.state.isClosed === false && this.props.triggerWhenOpen !== undefined ? this.props.triggerWhenOpen : this.props.trigger;

    // Don't render children until the first opening of the Collapsible if lazy rendering is enabled
    var children = this.props.children;
    if (this.props.lazyRender) if (!this.state.hasBeenOpened) children = null;

    var triggerClassName = this.props.classParentString + "__trigger" + ' ' + openClass + ' ' + disabledClass;

    if (this.state.isClosed) {
      triggerClassName = triggerClassName + ' ' + this.props.triggerClassName;
    } else {
      triggerClassName = triggerClassName + ' ' + this.props.triggerOpenedClassName;
    }

    return _react2.default.createElement(
      'div',
      { className: this.props.classParentString + ' ' + (this.state.isClosed ? this.props.className : this.props.openedClassName) },
      _react2.default.createElement(
        'span',
        { className: triggerClassName.trim(), onClick: this.handleTriggerClick },
        trigger
      ),
      this.renderNonClickableTriggerElement(),
      _react2.default.createElement(
        'div',
        { className: this.props.classParentString + "__contentOuter" + ' ' + this.props.contentOuterClassName, ref: 'outer', style: dropdownStyle },
        _react2.default.createElement(
          'div',
          { className: this.props.classParentString + "__contentInner" + ' ' + this.props.contentInnerClassName, ref: 'inner' },
          children
        )
      )
    );
  }
});

exports.default = Collapsible;

