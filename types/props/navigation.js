import PropTypes from 'prop-types';

export const navigationProp = PropTypes.shape({
  push: PropTypes.func.isRequired,
  pop: PropTypes.func.isRequired,
  dismissModal: PropTypes.func.isRequired,
  showModal: PropTypes.func.isRequired,
  showErrorModal: PropTypes.func.isRequired
});
