import React from 'react';
import PropTypes from 'prop-types';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import styled from 'styled-components';

import Icon from './Icon';

const BUTTON_SIZE = 30;

const CloseButton = styled.button.attrs({
  className: 'absolute circle shadow-subtle bg-white bold flex items-center cursor-pointer border border-white p0 hover-lime focus-lime'
})`
  top: ${-BUTTON_SIZE / 2}px;
  right: ${-BUTTON_SIZE / 2}px;
  width: ${BUTTON_SIZE}px;
  height: ${BUTTON_SIZE}px;

  &:focus {
    outline: none;
  }
`;

const DialogBackdrop = styled.div.attrs({
  className: 'absolute bg-white'
})`
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  opacity: 0.9;
`;

const DialogContainer = styled.div.attrs({
  className: 'flex flex-column'
})`
  width: 100vw;
  max-width: 100%;
  height: 100%;
  padding: 25px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  &:after {
    display: block;
    flex: 0 0 auto;
    height: 40px;
    content: '';
  }
`;
// NOTE: DialogContainer:after is a substitute for padding
// which would otherwise be applied, but is ignored by both
// Firefox and Safari!

const DialogBox = styled.div.attrs({
  className: 'background bg-white rounded-3 shadow-subtle relative'
})`
  width: 100%;
  max-width: ${(props) => props.width}px;
  margin: auto;
`;

const DialogWrapper = styled.div.attrs({
  className: 'fixed'
})`
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;
`;

class Dialog extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    closeable: PropTypes.bool,
    isOpen: PropTypes.bool,
    onRequestClose: PropTypes.func,
    width: PropTypes.number
  };

  static defaultProps = {
    closeable: true,
    isOpen: false,
    width: 500
  };

  constructor(initialProps) {
    super(initialProps);

    let rendered = false;
    let visible = false;

    if (initialProps.isOpen) {
      rendered = visible = true;
    }

    this.state = {
      rendered,
      visible
    };
  }

  componentDidMount() {
    document.documentElement.addEventListener('keydown', this.handleDocumentKeyDown, false);
  }

  componentWillUnmount() {
    document.documentElement.removeEventListener('keydown', this.handleDocumentKeyDown);
  }

  componentWillReceiveProps(nextProps) {
    // Opening the dialog
    if (!this.props.isOpen && nextProps.isOpen) {
      this.setState({ rendered: true }, () => {
        this.setState({ visible: true });
      });
    }

    // Closing the dialog
    if (this.props.isOpen && !nextProps.isOpen) {
      this.setState({ visible: false }, () => {
        // Give the animation some time to finish, then remove the dialog from
        // the DOM
        setTimeout(() => {
          this.setState({ rendered: false });
        }, 150);
      });
    }
  }

  componentDidUpdate() {
    // This locks the body's scrolling whenever the dialog is _rendered_
    const action = this.state.rendered ? 'add' : 'remove';
    document.body.classList[action]('overflow-hidden');
  }

  maybeClose = (event) => {
    event.preventDefault();
    if (typeof this.props.onRequestClose === 'function') {
      this.props.onRequestClose();
    }
  };

  handleCloseClick = (event) => {
    this.maybeClose(event);
  };

  handleDocumentKeyDown = (event) => {
    // Close the dialog on hitting the escape key
    if (this.state.visible && event.keyCode === 27) {
      this.maybeClose(event);
    }
  };

  renderBackdrop() {
    if (!this.state.visible) {
      return;
    }

    return <DialogBackdrop />;
  }

  renderCloseButton() {
    if (!this.props.closeable) {
      return;
    }

    return (
      <CloseButton onClick={this.handleCloseClick}>
        <Icon className="mx-auto" icon="close" title="Close" />
      </CloseButton>
    );
  }

  renderDialog() {
    if (!this.state.visible) {
      return;
    }

    return (
      <DialogContainer>
        <DialogBox width={this.props.width}>
          {this.renderCloseButton()}
          {this.props.children}
        </DialogBox>
      </DialogContainer>
    );
  }

  render() {
    if (!this.state.rendered) {
      return null;
    }

    return (
      <DialogWrapper>
        {this.renderBackdrop()}
        <CSSTransitionGroup transitionName="transition-slide-up" transitionEnterTimeout={150} transitionLeaveTimeout={300}>
          {this.renderDialog()}
        </CSSTransitionGroup>
      </DialogWrapper>
    );
  }
}

export default Dialog;
