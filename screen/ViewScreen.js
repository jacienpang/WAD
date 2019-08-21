/** 
* Name: <Pang Chong Xian>
* Reg . No . : <1603771>
*/

import React, { Component } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  TextInput,
  Text,
  View,
  ScrollView,
} from 'react-native';
import {
  InputWithLabel
} from './UI';
import { FloatingAction } from 'react-native-floating-action';
import moment from 'moment';

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

const actions = [{
  text: 'Edit',
  color: '#c80000',
  icon: require('./images/baseline_edit_white_18dp.png'),
  name: 'edit',
  position: 2
},{
  text: 'Delete',
  color: '#c80000',
  icon: require('./images/baseline_delete_white_18dp.png'),
  name: 'delete',
  position: 1
}];

let common = require('./CommonData');
let SQLite = require('react-native-sqlite-storage');


export default class ViewScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Movie Details'
    };
  };

  constructor(props) {
    super(props)

    this.state = {
      movieId: this.props.navigation.getParam('id'),
      movies: null,
    };

    this._query = this._query.bind(this);

    this.db = SQLite.openDatabase({name: 'moviesdb', createFromLocation : '~moviesdb.sqlite'}, this.openDb, this.errorDb);
  }

  componentDidMount() {
    this._query();
  }

  _query() {
    this.db.transaction((tx) => {
      tx.executeSql('SELECT * FROM movies WHERE id = ?', [this.state.movieId], (tx, results) => {
        if(results.rows.length) {
          this.setState({
            movies: results.rows.item(0),
          })
        }
      })
    });
  }

  _delete() {
    Alert.alert('Confirm Deletion', 'Delete `'+ this.state.movies.title +'`?', [
     {
      text: 'No',
         onPress: () => {},
       },
       {
         text: 'Yes',
         onPress: () => {
           this.db.transaction((tx) => {
             tx.executeSql('DELETE FROM movies WHERE id = ?', [this.state.movieId])
           });

           this.props.navigation.getParam('refresh')();
           this.props.navigation.goBack();
         },
       },
     ], { cancelable: false });
   }

  openDb() {
      console.log('Database opened');
  }

  errorDb(err) {
      console.log('SQL Error: ' + err);
  }

  render() {
    let movie = this.state.movies;

    return (
      <View style={styles.container}>
        <ScrollView>
          <InputWithLabel style={styles.output}
            label={'Title'}
            value={movie ? movie.title : ''}
            orientation={'vertical'}
            editable={false}
          />
          <InputWithLabel style={styles.output}
            label={'Language'}
            value={movie ? movie.language : ''}
            orientation={'vertical'}
            editable={false}
          />
          <InputWithLabel style={styles.output}
            label={'Release Date'}
            value={movie ? new Date(movie.release_date * 1000).formatted(): ''}
            orientation={'vertical'}
            editable={false}
          />
        </ScrollView>
         <FloatingAction
          actions={actions}
          color={'#a80000'}
          floatingIcon={(
            <Image
              source={require('./images/baseline_edit_white_18dp.png')}
            />
          )}
          onPressItem={(name) => {
              switch(name) {
                case 'edit':
                  this.props.navigation.navigate('Edit', {
                    id: movie ? movie.id : 0,
                    headerTitle: movie ? movie.title : '',
                    language: movie ? movie.language: '',
                    release_date: movie ? movie.release_date: '',
                    refresh: this._query,
                    homeRefresh: this.props.navigation.getParam('refresh'),
                  });
                  break;

                case 'delete':
                  this._delete();
                  break;
              }
            }
          }
        /> 
      </View>
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
    color: '#000000',
    marginTop: 10,
    marginBottom: 10,
  },
});