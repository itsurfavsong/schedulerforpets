import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import CustomerHomeScreen from '../screens/customer/CustomerHomeScreen';
import GroomerHomeScreen from '../screens/groomer/GroomerHomeScreen';
import GroomerListScreen from '../screens/customer/GroomerListScreen';
import GroomerDetailScreen from '../screens/customer/GroomerDetailScreen';
import ReservationConfirmScreen from '../screens/customer/ReservationConfirmScreen';
import GroomerReservationDetailScreen from '../screens/groomer/GroomerReservationDetailScreen';
import GroomerProfileScreen from '../screens/groomer/GroomerProfileScreen';
import PetManageScreen from '../screens/customer/PetManageScreen';
import PetFormScreen from '../screens/customer/PetFormScreen';
import ReviewFormScreen from '../screens/customer/ReviewFormScreen';
import ChatListScreen from '../screens/chat/ChatListScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import { RootStackParamList } from '../types';
import LandingScreen from '../screens/auth/LandingScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.user?.role);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!token ? (
          <>
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : role === 'groomer' ? (
          <>
            <Stack.Screen name="GroomerHome" component={GroomerHomeScreen} />
            <Stack.Screen name="GroomerReservationDetail" component={GroomerReservationDetailScreen} />
            <Stack.Screen name="ChatList" component={ChatListScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="GroomerProfile" component={GroomerProfileScreen} /> 
          </>
        ) : (
          <>
            <Stack.Screen name="CustomerHome" component={CustomerHomeScreen} />
            <Stack.Screen name="GroomerList" component={GroomerListScreen} />
            <Stack.Screen name="GroomerDetail" component={GroomerDetailScreen} />
            <Stack.Screen name="ReservationConfirm" component={ReservationConfirmScreen} />
            <Stack.Screen name="PetManage" component={PetManageScreen} />
            <Stack.Screen name="PetForm" component={PetFormScreen} />
            <Stack.Screen name="ReviewForm" component={ReviewFormScreen} />
            <Stack.Screen name="ChatList" component={ChatListScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
