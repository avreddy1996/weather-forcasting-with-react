import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      apiKey : '7b05645724bc06366fa9f6301476b929',
      location : 'hyderabad',
      data : ''
    }
  }
  getData(){
    var curl = 'https://api.openweathermap.org/data/2.5/forecast?q='+this.state.location+'&APPID='+this.state.apiKey;
    var self = this;
    this.getWeatherData(curl, function(err, res){
      if(err === null){
        self.setState({
          data : res
        })
      }else{
        self.setState({
          data : {error : res.message}
        })
      }
    })
  }
  getWeatherData(url, done){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        done(null, xhr.response);
      } else {
        done(status, xhr.response);
      }
    };
    xhr.send();
  }
  handleChange(e){
    this.setState({
      location : e.target.value
    })
  }
  componentWillMount(){
    this.getData();
  }
  render() {
    if(this.state.data){
    return (
      <div>
      <div className="panel">
      <input value={this.state.location} placeholder="Search for city" onChange={(e)=>this.handleChange(e)} />
      <button type="button" onClick={()=>this.getData()} >Get Weather data</button>
      </div>
      <div className="container" >
      <WeatherReport data={this.state.data}/></div></div>
      
    );
  }else{
    return <div className="loader-box">
    <div class="lds-dual-ring"></div></div>
  }
  }
}
class WeatherReport extends React.Component{
  
  render(){
    if(this.props.data.error){
      return <div className="error-response">{this.props.data.error}</div>
    }else{
      const weatherListArray = [];
    for(var i=0;i<this.props.data.list.length;i=i+8){
      weatherListArray.push(this.props.data.list[i]);
    }
    const weatherList = weatherListArray.map(renderWeatherList);
    function renderWeatherList(item, index){
      return(
        <WeatherReportList value={item} key={index} />
      )
    }
    return <div className="header-panel">
    <div className="weatherLayout">{weatherList}</div>
    <h2><a href={'https://www.google.com/maps/?q='+this.props.data.city.coord.lat+','+this.props.data.city.coord.lon} target="_blank"><span className="fa fa-map-marker" ></span></a>&nbsp;&nbsp;{this.props.data.city.name} , {this.props.data.city.country}</h2></div>
    }
  }
}
class WeatherReportList extends React.Component{
  render(){
    function getDayName(params) {
    var date = new Date(params);
    var day = '';
    switch(date.getDay()){
      case 1:
      day = "Monday";
      break;
      case 2:
      day = "Tuesday";
      break;
      case 3:
      day = "Wednesday";
      break;
      case 4:
      day = "Thursday";
      break;
      case 5:
      day = "Friday";
      break;
      case 6:
      day = "Saturday";
      break;
      case 7:
      day = "Sunday";
      break;
      default:
      day = "Day";
    }
    return day;
    }
    return(
      <div className="graph" ><img src={'http://openweathermap.org/img/w/'+this.props.value.weather[0].icon+'.png'} />
      <h5>{(this.props.value.main.temp - 273).toFixed(2)} <sup>o</sup>C</h5>
      <h6>{getDayName(this.props.value.dt_txt)}</h6></div>
    )
  }
}
export default App;
