import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import Boxoffice from './boxoffice';
import Favourite from './favourite';
import Home from './home';
import NewMovie from './newmovie';
const Drawer = createDrawerNavigator();
export default function DrawerLayout() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={Home}
                     options={{ drawerLabel: 'Home' }} />
     <Drawer.Screen name="Favourite" component={Favourite}
                     options={{ drawerLabel: 'Favourite' }} />
     <Drawer.Screen name="Boxoffice" component={Boxoffice}
                     options={{ drawerLabel: 'Box Office' }} />
     <Drawer.Screen name="NewMovie" component={NewMovie}
                     options={{ drawerLabel: 'New Movie' }} />
   </Drawer.Navigator>
  );
}

