import React from 'react';
import axios from 'axios';
import MuniLineLayout from './MuniLineLayout';
import Messages from './Messages';
import ListView from "../common_components/ListView";

class MainContainer extends React.Component {
    constructor() {
        super();
        this.state = {interval: 0, muniList: [], messages: ['no messages yet']};
    }

    parseResponse = (response) => {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(response.data, "text/xml");
        let jsonPredictions = this.xmlToJson(xmlDoc);
        let muniObject = {};
        let routeObject = {};
        let directionObject = {};
        let predictionCount = 0;
        muniObject['routes'] = [];
        jsonPredictions.body.predictions.map(function(direction){
            if(!routeObject.hasOwnProperty('route')) {
                routeObject['route'] = direction['@attributes'].routeTitle;
                routeObject['id'] = direction['@attributes'].stopTag;
            } else if (routeObject.route !== direction['@attributes'].routeTitle){
                routeObject = {};
                routeObject['route'] = direction['@attributes'].routeTitle;
                routeObject['id'] = direction['@attributes'].stopTag;
            }
            if(!routeObject.hasOwnProperty('directions')) {
                routeObject.directions = [];
            }
            if(!directionObject.hasOwnProperty('direction')){
                directionObject['direction'] = direction.direction['@attributes'].title;
            } else if (directionObject.direction !== direction.direction['@attributes'].title){
                directionObject = {};
                directionObject['direction'] = direction.direction['@attributes'].title;
            }
            directionObject['predictions'] = [];


            direction.direction.prediction.map(function(prediction){
                if(predictionCount < 4) {
                    directionObject.predictions.push(prediction['@attributes'].minutes);
                    predictionCount = predictionCount + 1;
                } else {
                    predictionCount = 0;
                }

                return null;
            });

            if(!routeObject.directions.includes(directionObject)) {
                routeObject.directions.push(directionObject);
            }
            if(!muniObject.routes.includes(routeObject)){
                muniObject.routes.push(routeObject);
            }


            return null;
        });
        console.log(JSON.stringify(muniObject));
        this.setState({muniList: muniObject.routes});

    };

    componentDidMount(){
        this.timer = setInterval(()=> this.tick(), 60000);
        //call messages endpoint
        this.callNextBus();
    }

    componentWillUpdate(prevProps, prevState){
        if(this.state.interval !== prevState){
            this.callNextBus();
        }
    }

    componentWillUnmount(){
        clearInterval(this.timer);
    }

    callNextBus = () => {
        axios.get('http://webservices.nextbus.com/service/publicXMLFeed?command=predictionsForMultiStops&a=sf-muni&stops=N|5215&stops=N|5216&stops=18|3574&stops=18|3575').then(this.parseResponse);
    };

    tick() {
        let ping = this.state.interval;
        this.setState({interval: ping+1});
    }

    muniLayout = (muniLine) => {
        return(<MuniLineLayout muniObject={muniLine}/>)
    };

    muniClickCallback = () => {
        console.log("Muni Line Clicked");
    };

    // Changes XML to JSON
    xmlToJson = (xml) => {

    	// Create the return object
    	let obj = {};

    	if (xml.nodeType === 1) { // element
    		// do attributes
    		if (xml.attributes.length > 0) {
    		obj["@attributes"] = {};
    			for (let j = 0; j < xml.attributes.length; j++) {
    				let attribute = xml.attributes.item(j);
    				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
    			}
    		}
    	} else if (xml.nodeType === 3) { // text
    		obj = xml.nodeValue;
    	}

    	// do children
    	if (xml.hasChildNodes()) {
    		for(let i = 0; i < xml.childNodes.length; i++) {
    			let item = xml.childNodes.item(i);
    			let nodeName = item.nodeName;
    			if (typeof(obj[nodeName]) === "undefined") {
    				obj[nodeName] = this.xmlToJson(item);
    			} else {
    				if (typeof(obj[nodeName].push) === "undefined") {
    					let old = obj[nodeName];
    					obj[nodeName] = [];
    					obj[nodeName].push(old);
    				}
    				obj[nodeName].push(this.xmlToJson(item));
    			}
    		}
    	}
	    return obj;
    };

    render() {
        return(<div>
            <div>
                <ListView items={this.state.muniList} itemLayout={this.muniLayout} itemSelectCallback={this.muniClickCallback}/>
            </div>
            <div>
                <Messages messages={this.state.messages}/>
            </div>
        </div>);
    }
}

export default MainContainer;