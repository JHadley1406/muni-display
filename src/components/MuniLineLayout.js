import React from 'react';
import PropTypes from 'prop-types';
import ListView from "../common_components/ListView";
import DirectionContainer from "./DirectionContainer";
import Col from 'react-bootstrap/lib/Col';

class MuniLineLayout extends React.Component{

    directionLayout = (direction) => {
        return(<DirectionContainer directionObject={direction}/>)
    };

    directionClickCallback = () => {
        console.log("Direction clicked");
    };

    render() {
        return(<Col md={6} style={{background: 'lightgrey', border: '2px solid black', borderRadius: '5px'}}>
            <Col md={2}>
                <h3>{this.props.muniObject.route}</h3>
            </Col>
            <Col md={10}>
            <ListView items={this.props.muniObject.directions}
                      itemLayout={this.directionLayout}
                      itemSelectCallback={this.directionClickCallback}/>
            </Col>
        </Col>);
    }

}

MuniLineLayout.propType = {
    muniObject: PropTypes.object.isRequired
};

export default MuniLineLayout;