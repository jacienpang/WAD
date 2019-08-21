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
  DatePickerAndroid,
  ScrollView,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';



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

import {
  InputWithLabel,
  PickerWithLabel,
  AppButton,
} from './UI';


let common = require('./CommonData');
let SQLite = require('react-native-sqlite-storage');

export default class CreateScreen extends React.Component {
  static navigationOptions = {
    title: 'Add Movie',
  };

  constructor(props) {
    super(props)

    this.state = {
      title: '',
      language: '01',
      release_date: '',
      
    };

    this._insert = this._insert.bind(this);

    this.db = SQLite.openDatabase({name: 'moviesdb', createFromLocation : '~moviesdb.sqlite'}, this.openDb, this.errorDb);
  }

  

  _insert() {
    if (this.state.title != '') {
      //Check for the Name TextInput
      if (this.state.language != '') {
        if(this.state.release_date != ''){
           //Check for the Email TextInput
      
           this.db.transaction((tx) => {
            tx.executeSql('INSERT INTO movies(title,language,release_date) VALUES(?,?,?)', [
              this.state.title,
              common.getValue(common.languages, this.state.language),
              parseInt((new Date(this.state.date).getTime() / 1000).toFixed(0)),
            ]);
          });
      
          this.props.navigation.getParam('refresh')();
          this.props.navigation.goBack();
            
          } else {
        alert('Please pick a release date');
      }
    } else {
      alert('Please pick a language');
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
          date: selectedDate,
          release_date: selectedDate.formatted(),
        });
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <InputWithLabel style={styles.input}
          label={'Title'}
          value={this.state.title}
          onChangeText={(title) => {this.setState({title})}}
          orientation={'vertical'}
        />
         <PickerWithLabel style={styles.picker}
          label={'Language'}
          items={common.languages}
          mode={'dialog'}
          value={this.state.language}
          onValueChange={(itemValue, itemIndex) => {
            this.setState({language: itemValue})
          }}
          orientation={'vertical'}
          textStyle={{fontSize: 50}}
        />

        <TouchableWithoutFeedback
          onPress={() => this.openDatePicker()}
          >
            <View>
              <InputWithLabel
                label={'Release Date'}
                style={styles.dateInput}
                value={this.state.release_date}
                placeholder='Pick a Date'
                editable={false}
                underlineColorAndroid={'transparent'}
              />
              </View>
          </TouchableWithoutFeedback>
          
        <AppButton style={styles.button}
          title={'Save'}
          theme={'primary'}
          onPress={this._insert}
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
  button: {
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
});