import { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

const frameStyle = {
  border: '0px'
}

const FrameWrapper = (props) => {

  const {
    show, targetUrl,
    sourceDomain, onMessage,
    onHide, height, width, blurredId
  } = props;

  // listen to events for the window
  // const MessageHandler = (event) => {
  //   const { data, origin } = event;
  //   console.log('MessageHandler() data:', data);
  //   // origin is the full domain of the source window i.e. <protocol><hostname>[port]
  //   // if it doesn't match what we are expecting, ignore it.
  //   if (origin != sourceDomain) return;
  //   // pass the message on
  //   onMessage(data);
  // };

  // listen to events for the window
  const MessageHandler = (event) => {
    const { data } = event;
    console.log('MessageHandler() data:', data);
    if (data) onMessage(data);
  };

  // When component has mounted, add an event listener to the document window
  useEffect(() => {
    if (show) {
      window.addEventListener('message', MessageHandler, false);
      return () => {
        // removes event listener when component is unmounted
        window.removeEventListener('message', MessageHandler);
      };
    }
  }); // effect only executed when show changes

  // uses the blurElement property to apply the blur filter when modal is displayed
  useEffect(() => {
    const elem = document.getElementById(blurredId);
    if (show && elem) elem.classList.add('background-blur');
    return () => {
      if (elem) elem.classList.remove('background-blur');
    }
  }); // effect only executed when show changes

  // show controls the visibility of the modal window and the target of the iframe
  const src = show ? targetUrl : '';

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Body>
        <iframe style={frameStyle} src={src} className='frame-wrapper' />
      </Modal.Body>
    </Modal>
  )
}

FrameWrapper.propTypes = {
  show: PropTypes.bool,
  sourceDomain: PropTypes.string.isRequired,
  targetUrl: PropTypes.string.isRequired,
  onMessage: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  height: PropTypes.number,
  width: PropTypes.number,
  blurredId: PropTypes.string
}

FrameWrapper.defaultProps = {
  show: false,
  height: 420,
  width: 360,
  blurredId: ''
}

export default FrameWrapper;
