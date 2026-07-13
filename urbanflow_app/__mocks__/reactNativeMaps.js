import React from 'react';

const MapView = (props) => React.createElement(React.Fragment, null, props.children);
const Marker = (props) => React.createElement(React.Fragment, null, props.children);
const Polyline = () => null;
const Circle = () => null;
const PROVIDER_GOOGLE = 'google';
const PROVIDER_DEFAULT = 'default';

export { MapView, Marker, Polyline, Circle, PROVIDER_GOOGLE, PROVIDER_DEFAULT };
export default MapView;
