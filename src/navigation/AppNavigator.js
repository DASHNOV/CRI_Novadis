import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { COLORS } from '../utils/constants';

import {
    HomeScreen,
    CRIProjetScreen,
    CRIServiceScreen,
    HistoryScreen
} from '../screens';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: COLORS.primary,
                    },
                    headerTintColor: COLORS.white,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerBackTitleVisible: false,
                }}
            >
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ title: 'Accueil' }}
                />
                <Stack.Screen
                    name="CRIProjet"
                    component={CRIProjetScreen}
                    options={{ title: 'Nouveau CRI Projet' }}
                />
                <Stack.Screen
                    name="CRIService"
                    component={CRIServiceScreen}
                    options={{ title: 'Nouveau CRI Service' }}
                />
                <Stack.Screen
                    name="History"
                    component={HistoryScreen}
                    options={{ title: 'Historique' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
