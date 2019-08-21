/** 
* Name: <Pang Chong Xian>
* Reg . No . : <1603771>
*/
import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  ScrollView,
  DatePickerAndroid,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  InputWithLabel,
  PickerWithLabel,
  AppButton,
} from './UI'

Date.prototype.formatted = function() {
    let day = this.getDay();
    let date = this.getDate();
    let month = this.getMonth();
    let year = this.getFullYear();
    let daysText = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    let monthsText = [
      'Jan','Feb','Mar','Apr','May','Jun',
      'Jul','Aug','Sep','Oct','Nov','Dec'
    ];
  
    return `${daysText[day]}, ${monthsText[month]} ${date}, ${year}`;
  }
  
let common = require('./CommonData');
let SQLite = require('react-native-sqlite-storage');

export default class EditScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Edit'
    };
  };

  constructor(props) {
    super(props)

    this.state = {
      movieId: this.props.navigation.getParam('id'),
      title: '',
      venue: '',
      date: '',
      date: new Date(),
    };

    this._query = this._query.bind(this);
    this._update = this._update.bind(this);

    this.db = SQLite.openDatabase({name: 'eventsdb', createFromLocation : '~eventsdb.sqlite'}, this.openDb, this.errorDb);
  }

  componentDidMount() {
    this._query();
  }

  _query() {
    this.db.transaction((tx) => {
      tx.executeSql('SELECT * FROM events WHERE id = ?', [this.state.eventId], (tx, results) => {
        if(results.rows.length) {
          this.setState({
            title: results.rows.item(0).event_title,
            venue: results.rows.item(0).event_venue,
            date: new Date(results.rows.item(0).event_date * 1000).formatted(),
          })
        }
      })
    });
  }

  _update() {
    if (this.state.title != '') {
        //Check for the Name TextInput
        if (this.state.venue != '') {
          if(this.state.date != ''){
             //Check for the Email TextInput
            
             this.db.transaction((tx) => {
                tx.executeSql('UPDATE events SET event_title=?,event_venue=?,event_date=? WHERE id=?', [
                  this.state.title,
                  this.state.venue,
                  parseInt((new Date(this.state.date).getTime() / 1000).toFixed(0)),
                  this.state.eventId,
                ]);
              });
          
              this.props.navigation.getParam('refresh')();
              this.props.navigation.getParam('homeRefresh')();
              this.props.navigation.goBack();
            } else {
          alert('Please pick a date');
        }
      } else {
        alert('Please pick a venue');
      }
    }else {
        alert('Please enter the title')
      }
   
  }

  openDatePicker = async () => {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        date: this.state.date,
        minDate: new Date(1800, 0, 1),
        maxDate: new Date(2099, 11, 31),
        mode: 'calendar', // try also with `spinner`
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        // Selected year, month (0-11), day
        let selectedDate = new Date(year, month, day);

        this.setState({
          date: selectedDate.formatted(),
        });
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  }


  openDb() {
      console.log('Database opened');
  }

  errorDb(err) {
      console.log('SQL Error: ' + err);
  }

  render() {
    let event = this.state.events;

    return (
      <ScrollView style={styles.container}>
        <InputWithLabel style={styles.input}
          label={'Event Title'}
          value={this.state.title}
          onChangeText={(event_title) => {this.setState({event_title})}}
          orientation={'vertical'}
        />

        <InputWithLabel style={styles.input}
          label={'Event Venue'}
          value={this.state.venue}
          onChangeText={(event_venue) => {this.setState({event_venue})}}
          orientation={'vertical'}
        />

        <TouchableWithoutFeedback
          onPress={() => this.openDatePicker()}
          >
            <View>
              <InputWithLabel
                label={'Event Date'}
                style={styles.dateInput}
                value={this.state.date}
                onDateChange={event_date => {
                    this.setState({ event_date: event_date });}}
                editable={false}
                underlineColorAndroid={'transparent'}
              />
              </View>
          </TouchableWithoutFeedback>
        <AppButton style={styles.button}
          title={'Save'}
          theme={'primary'}
          onPress={this._update}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  output: {
    fontSize: 24,
    color: '#000099',
    marginTop: 10,
    marginBottom: 10,
  },
  dateInput: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
    color: '#000099',
    borderBottomWidth: 2,
    borderBottomColor: 'black',
  },
  input: {
    fontSize: 20,
    color: '#000099',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'black',
  },
  picker: {
    color: '#000099',
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
  },
});