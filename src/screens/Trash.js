import React from 'react'
import { TouchableHighlight, StyleSheet, Platform, Image, Text, View, ScrollView, TouchableOpacity, Dimensions} from 'react-native'
import PropTypes from 'prop-types';
import firebase from 'react-native-firebase'
import {NavigationActions} from 'react-navigation'
import {Button} from 'react-native-elements'
import { Icon } from 'react-native-elements'
import SideMenu from 'react-native-side-menu';
import Menu from './../menu/Menu'
import Modal from "react-native-simple-modal";
import {strings} from './../components/Localization';

const image = require('./../menu/assets/menu.png');

export default class Trash extends React.Component {
  state = { open: false };

  modalDidClose = () => {
    this.setState({ open: false });
  };

  openModal = (noteKey) => {
    this.setState({ open: true });
    this.setState({noteKey:noteKey})
  }


    constructor(props) {
      super(props);
      this.toggle = this.toggle.bind(this);

      this.state = {
        isOpen: false,
        selectedItem: strings.trashJs.title,
        currentUser: null , 
        items : [], 
        noteKey:null,
      };
    }
  

//Edit Note START
  _onPressButton=(itemq, itemk, itemc, itemt)=>{
      this.props.navigation.navigate('Show', { data: itemq, notkey: itemk, noteBgColor:itemc, noteTitle:itemt});
  }
//Edit Note END

  deleteNote=()=>{
   const { currentUser } = firebase.auth();
   this.setState({ currentUser });
   const noteItemKey = this.state.noteKey;
   const ref ="Users/"+currentUser.uid+"/"+noteItemKey;

   firebase.database().ref(ref).remove().then((data)=>{
     //success callback
  alert("not silindi")
 }).catch((error)=>{
     //error callback
     alert(error);
 })

 this.setState({open:false})
  }

 updatePlaceId=(placeId)=>{
  const { currentUser } = firebase.auth();
  this.setState({ currentUser });
  const mail = currentUser.email;
  const noteItemKey = this.state.noteKey;

 const ref ="Users/"+currentUser.uid+"/"+noteItemKey;
  firebase.database().ref(ref).update({
     placeId:placeId,
  }).then((data)=>{
      //success callback
    // alert("Başarılı");
   //this.props.navigation.navigate('Arsiv');
  }).catch((error)=>{
      //error callback
      alert(error);
  })

  this.setState({open:false})
 }


  componentDidMount() {
    //menünün açılması için Params olarak fonksiyonu tanıtmak gerekiyormuş.
    this.props.navigation.setParams({ toggle: this.toggle });
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })
    const referans = "/Users/"+currentUser.uid;
    firebase.database().ref(referans).orderByChild('placeId').equalTo(3).on('value', snapshot => {
      snapshot.forEach((child) => {
        let data = snapshot.val();
        let items = Object.values(data);
        this.setState({ items });
      })
    });
  }

/* Menu START*/
toggle() {
  this.setState({
    isOpen: !this.state.isOpen,
  });
}

updateMenuState(isOpen) {
  this.setState({ isOpen });
}

onMenuItemSelected= (item) =>{
  this.setState({
    isOpen: false,
    selectedItem: item,
  });

  if(item === 'Ana Sayfa'){
    this.props.navigation.navigate('Main');
  }

  else if(item === 'Arsiv')
  {
      this.props.navigation.navigate('Arsiv');
  }

  else if(item === 'About')
  {
      this.props.navigation.navigate('About');
  }

  else if (item === 'Trash'){
        this.props.navigation.navigate('Trash');
  }
      
  else if (item === 'Ayarlar'){
        this.props.navigation.navigate('Ayarlar');
  } 
  else if (item === 'Profile'){
    this.props.navigation.navigate('Profile');
}
}
 
  static navigationOptions =({ navigation }) => {
    return {
      title: strings.trashJs.title,
      headerStyle: {
      backgroundColor: '#8c52ff',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
      fontWeight: 'bold',
      },

    headerLeft: (
     <TouchableOpacity style={{marginLeft: 10 }} onPress={navigation.getParam('toggle')}>
          <Image
            source={image}
            style={{ width: 32, height: 32 }}
          />
        </TouchableOpacity>
       )
    }
}
/*Menu END */


  render() {
      const { currentUser } = this.state
      const menu = <Menu onItemSelected={this.onMenuItemSelected} />;

  return (
    <SideMenu
    menu={menu}
    isOpen={this.state.isOpen}
    onChange={isOpen => this.updateMenuState(isOpen)}>

    <View style={styles.container}>
      <ScrollView  style={styles.ScrollContainer} >
        <View style={styles.itemsList}>
          {this.state.items.map((item, index) => {
          
            return (  
              <View  key={index}>
                
                <TouchableOpacity style={{  margin: 3,
                   width: Dimensions.get('window').width / 2 -10,
                   height: 200,
                   borderWidth: 0.9,
                   borderColor: '#ddd',
                   borderRadius:10,
                   color:'black',
                   backgroundColor: item.noteBgColor}}  onPress={()=>alert("Çöp Kutusundaki notlar düzenlenemez")} underlayColor="white"
                   onLongPress = {this.openModal.bind(this, item.yazid)}>
                 
                   <Text style={{marginLeft:4, padding:2,marginTop:10, maxHeight:190}}> 

                   <Text style={{fontWeight:'bold', fontSize:18}}>{"  "}{item.noteTitle}{" \n "}</Text>
                   {item.not}</Text>
                </TouchableOpacity>        
              </View>
            );
          }
        )
      }

        </View>
      </ScrollView>
      
      <Modal
          offset={this.state.offset}
          open={this.state.open}
          modalDidOpen={this.modalDidOpen}
          modalDidClose={this.modalDidClose}
          style={{ alignItems: "center" }}>
        
          <View style={{ alignItems: "center" }}>
            <Text style={{margin:10, fontSize:20}}>{strings.trashJs.selectOption}</Text>
          <View style={{flexDirection: 'row', backgroundColor:this.state.noteBgColor, zIndex:50}}>
       <TouchableOpacity style={{width:Dimensions.get('window').width /6-10,  backgroundColor:this.state.noteBgColor, }} 
       onPress={this.updatePlaceId.bind(this, 1)}>
      <Icon
        name="delete-restore"
        type='material-community'
        color="black"
        size={28}
      />
       </TouchableOpacity>

       <TouchableOpacity style={{width:Dimensions.get('window').width /6-10, backgroundColor:this.state.noteBgColor,marginBottom:2}} 
     onPress={this.deleteNote}>
      <Icon
        name='delete-forever'
        type='material'
        color="black"     
        size={28}
      />
       </TouchableOpacity>

       <TouchableOpacity style={{width:Dimensions.get('window').width /6-10, backgroundColor:this.state.noteBgColor,}} 
       onPress={()=>this.setState({open:false})}>
      <Icon
        name="close"
        type='font-awesome'
        color="black"
        size={28}
      />
       </TouchableOpacity>
        </View>
          </View>
        </Modal>

      </View>
  
</SideMenu>
    )
  }
}

  const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'white'
    },

  ScrollContainer:{
      flex: 1,
      },

  itemsList: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: 2,
  },
})

