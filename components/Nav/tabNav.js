import React, { useEffect } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Login from '../../pages/login'
import Home from '../../pages/Home'
import FocusComic from '../../pages/focusComic'
import PullList from '../../pages/pullList'
import Collection from '../../pages/collection'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { getLogedAsync, getLogedState } from '../../redux/reducers/logedIn'
import { getPullListAsync } from '../../redux/reducers/pullList'
import { getCollectionAsync } from '../../redux/reducers/collection'

const Tab = createBottomTabNavigator()
const HomeStack = createStackNavigator()
const CollectionStack = createStackNavigator()

const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen
        name="FoucsComic"
        options={({ route }) => ({ title: route.params.Comic.title })}
        component={FocusComic}
      />
    </HomeStack.Navigator>
  )
}
const CollectionStackScreen = () => {
  return (
    <CollectionStack.Navigator>
      <CollectionStack.Screen name="Collection" component={Collection} />
      <CollectionStack.Screen
        name="FoucsComic"
        options={({ route }) => ({
          title: route.params.Comic.issue_number
            ? route.params.Comic.title + ' ' + route.params.Comic.issue_number
            : route.params.Comic.title
        })}
        component={FocusComic}
      />
    </CollectionStack.Navigator>
  )
}
const PullStackScreen = () => {
  return (
    <CollectionStack.Navigator>
      <CollectionStack.Screen name="Pull List" component={PullList} />
    </CollectionStack.Navigator>
  )
}

//////TODO: MAKE SO DONT HAVE TO HAVE 2 SEPERATE TAB NAVS FOR LOGED AND NOT LOGED
const TabNav = () => {
  const loged = useAppSelector(getLogedState)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getLogedAsync())
    dispatch(getPullListAsync())
    dispatch(getCollectionAsync())
  }, [loged])

  // 2 Different Bottom Navs for Logged in and not.
  if (loged) {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName

            if (route.name === 'Main') {
              iconName = focused ? 'ios-home' : 'ios-home'
            } else if (route.name === 'Register') {
              iconName = focused ? 'ios-list-box' : 'ios-list'
            } else if (route.name === 'Pull List') {
              iconName = 'arrow-down-outline'
            } else if (route.name === 'Collection') {
              iconName = 'albums-outline'
            }

            return <Ionicons name={iconName} size={size} color={color} />
          }
        })}
        tabBarOptions={{
          activeTintColor: 'red',
          inactiveTintColor: 'gray'
        }}
      >
        <Tab.Screen name="Main" component={HomeStackScreen} />
        <Tab.Screen name="Pull List" component={PullStackScreen} />
        <Tab.Screen name="Collection" component={CollectionStackScreen} />
      </Tab.Navigator>
    )
  } else {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName

            if (route.name === 'Main') {
              iconName = focused ? 'ios-home' : 'ios-home'
            } else if (route.name === 'Register') {
              iconName = focused ? 'ios-list-box' : 'ios-list'
            } else if (route.name === 'Pull List') {
              iconName = 'md-arrow-round-down'
            } else if (route.name === 'Collection') {
              iconName = 'mdi-arrow-down '
            } else if (route.name === 'Login') {
              iconName = 'ios-log-in'
            }

            return <Ionicons name={iconName} size={size} color={color} />
          }
        })}
        tabBarOptions={{
          activeTintColor: 'red',
          inactiveTintColor: 'gray'
        }}
      >
        <Tab.Screen name="Main" component={HomeStackScreen} />
        <Tab.Screen name="Login" component={Login} />
      </Tab.Navigator>
    )
  }
}

export default TabNav
