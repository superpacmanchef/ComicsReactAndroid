import React, { useContext, useEffect } from "react";
import { getLoged } from "../apis/UserDatabaseApi";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import Login from "../pages/login";
import Home from "../pages/Home";
import FocusComic from "../pages/focusComic";
import LogedContext from "../contexts/logedContext";
import PullList from "../pages/pullList";
import Collection from "../pages/collection";

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const CollectionStack = createStackNavigator();

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
  );
};
const CollectionStackScreen = () => {
  return (
    <CollectionStack.Navigator>
      <CollectionStack.Screen name="Collection" component={Collection} />
      <CollectionStack.Screen
        name="FoucsComic"
        options={({ route }) => ({ title: route.params.Comic.title })}
        component={FocusComic}
      />
    </CollectionStack.Navigator>
  );
};
const PullStackScreen = () => {
  return (
    <CollectionStack.Navigator>
      <CollectionStack.Screen name="Pull List" component={PullList} />
    </CollectionStack.Navigator>
  );
};

//////TODO: MAKE SO DONT HAVE TO HAVE 2 SEPERATE TAB NAVS FOR LOGED AND NOT LOGED
const TabNav = () => {
  const [loged, updateLoged] = useContext(LogedContext);

  useEffect(() => {
    getLoged().then((res) => {
      updateLoged(res.data);
    });
  }, []);

  // 2 Different Bottom Navs for Logged in and not.
  if (loged) {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Main") {
              iconName = focused ? "ios-home" : "ios-home";
            } else if (route.name === "Register") {
              iconName = focused ? "ios-list-box" : "ios-list";
            } else if (route.name === "Pull List") {
              iconName = "md-arrow-round-down";
            } else if (route.name === "Collection") {
              iconName = "md-filing";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: "red",
          inactiveTintColor: "gray",
        }}
      >
        <Tab.Screen name="Main" component={HomeStackScreen} />
        <Tab.Screen name="Pull List" component={PullStackScreen} />
        <Tab.Screen name="Collection" component={CollectionStackScreen} />
      </Tab.Navigator>
    );
  } else {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Main") {
              iconName = focused ? "ios-home" : "ios-home";
            } else if (route.name === "Register") {
              iconName = focused ? "ios-list-box" : "ios-list";
            } else if (route.name === "Pull List") {
              iconName = "md-arrow-round-down";
            } else if (route.name === "Collection") {
              iconName = "md-filing";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: "red",
          inactiveTintColor: "gray",
        }}
      >
        <Tab.Screen name="Main" component={HomeStackScreen} />
        <Tab.Screen name="Login" component={Login} />
      </Tab.Navigator>
    );
  }
};

export default TabNav;
