import React from 'react';
import PropTypes from 'prop-types';
import ListView from "../common_components/ListView";
import DirectionContainer from "./DirectionContainer";
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';

class MuniLineLayout extends React.Component{

    directionLayout = (direction) => {
        return(<DirectionContainer directionObject={direction}/>)
    };

    directionClickCallback = () => {
        console.log("Direction clicked");
    };


    render() {
        return(<Col md={4} >
            <Panel header={this.props.muniObject.routeTitle} style={{background: 'lightgrey', border: '2px solid black', borderRadius: '5px'}}>
                <ListView items={this.props.muniObject.direction}
                              itemLayout={this.directionLayout}
                              itemSelectCallback={this.directionClickCallback}/>
            </Panel>

        </Col>);
    }

}

MuniLineLayout.propType = {
    muniObject: PropTypes.object.isRequired
};

export default MuniLineLayout;
