/** 
* Name: <Pang Chong Xian>
* Reg . No . : <1603771>
*/
import {
  createStackNavigator,
  createAppContainer,
} from 'react-navigation';
import HomeScreen from './screen/HomeScreen';
import ViewScreen from './screen/ViewScreen';
import CreateScreen from './screen/CreateScreen';
import EditScreen from './screen/EditScreen';

const AppNavigator = createStackNavigator({
  Home : HomeScreen,
  View : ViewScreen,
  Create : CreateScreen,
  Edit : EditScreen,
},
{
  initialRouteName:'Home'
});

export default createAppContainer(AppNavigator);
