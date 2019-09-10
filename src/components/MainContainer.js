import React from 'react';
import axios from 'axios';
import MuniLineLayout from './MuniLineLayout';
import Messages from './Messages';
import ListView from "../common_components/ListView";

class MainContainer extends React.Component {
    constructor() {
        super();
        this.state = {interval: 0, muniList: [], messages: [{'id': '555', 'messages':'no messages yet'}]};
    }

    parsePredictions = (response) => {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(response.data, "text/xml");
        this.setState({muniList: this.xmlToJson(xmlDoc).predictions});

    };

    parseMessages = (response) => {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(response.data, "text/xml");
        let xmlMessages = xmlDoc.getElementsByTagName('text');
        let messages = [];
        for(let i = 0; i < xmlMessages.length; i++){
            messages.push({'id': i.toString(), 'text': xmlMessages[i].innerHTML});
        }
        this.setState({messages: messages});
    };

    componentWillMount(){
        this.timer = setInterval(()=> this.tick(), 30000);
        //call messages endpoint
        this.callNextBus();
    }

    componentWillUpdate(prevProps, prevState){
        if(this.state.interval !== prevState.interval){
            this.callNextBus();
        }
    }

    componentWillUnmount(){
        clearInterval(this.timer);
    }

    callNextBus = () => {
        axios.get('http://webservices.nextbus.com/service/publicXMLFeed?command=predictionsForMultiStops&a=sf-muni&stops=N|5215&stops=N|5216&stops=18|3574&stops=18|3575&stops=NX|5216&stops=NX|5215').then(this.parsePredictions);
        axios.get('http://webservices.nextbus.com/service/publicXMLFeed?command=messages&a=sf-muni&r=18&r=N&r=NX').then(this.parseMessages);
    };

    tick() {
        let ping = this.state.interval;
        ping++;
        this.setState({interval: ping});
    }

    muniLayout = (muniLine) => {
        return(<MuniLineLayout muniObject={muniLine}/>)
    };

    muniClickCallback = () => {
        console.log("Muni Line Clicked");
    };

    // Changes XML to JSON
    xmlToJson = (xml) => {
        let obj = {};
        obj.predictions = [];
        let xmlPredictionList = xml.getElementsByTagName('predictions');
        for(let i = 0; i < xmlPredictionList.length; i++){
            let routeObject = {'id': i.toString(), 'routeTitle': xmlPredictionList[i].attributes.routeTitle.value};
            routeObject.direction = [];
            let directionObject = {};
            let direction = xmlPredictionList[i].getElementsByTagName('direction');
            let directionPredictions = [];

            if(xmlPredictionList[i].hasAttribute('dirTitleBecauseNoPredictions')){
                directionObject = {'id': '555'+xmlPredictionList[i].attributes.stopTag.value, 'title': xmlPredictionList[i].attributes.dirTitleBecauseNoPredictions.value, 'prediction': []};
                directionObject.prediction.push({'id': '555', 'minutes': 'NA'});
                routeObject.direction.push(directionObject);
            }


            if(xmlPredictionList[i].getElementsByTagName('direction').length !== 0){
                directionPredictions = direction[0].getElementsByTagName('prediction');
            }

            for(let dirCount = 0; dirCount < direction.length; dirCount++){
                directionObject = {'id': dirCount.toString()+xmlPredictionList[i].attributes.stopTag.value, 'title': direction[dirCount].attributes.title.value, 'prediction': []};
                for (let predictionCount = 0; predictionCount < directionPredictions.length; predictionCount++) {
                    if (predictionCount < 4) {
                        let minute = {'id':directionPredictions[predictionCount].attributes.epochTime.value,
                            'minutes': directionPredictions[predictionCount].attributes.minutes.value};
                        directionObject.prediction.push(minute);
                    }
                }
                routeObject.direction.push(directionObject);
            }
            if(!obj.predictions.some(function(line){
                return line.routeTitle === routeObject.routeTitle;
                })) {
                obj.predictions.push(routeObject);
            } else{
                for(let line = 0; line < obj.predictions.length; line ++){
                    if(obj.predictions[line].routeTitle === routeObject.routeTitle){
                        obj.predictions[line].direction.push(routeObject.direction[0]);
                    }
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