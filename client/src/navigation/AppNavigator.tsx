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

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type CustomerStackParamList = {
  CustomerHome: undefined;
  GroomerList: undefined;
  GroomerDetail: { groomerId: string; groomerName: string };
  ReservationConfirm: {
    groomerId: string;
    groomerName: string;
    date: string;
    startTime: string;
    endTime: string;
  };
  PetManage: undefined; 
  PetForm: { petId?: string; petName?: string }; 
  ReviewForm: {                    
    groomerId: string;
    groomerName: string;
    reservationId: string;
    reviewId?: string;              
    existingRating?: number;
    existingComment?: string;
  };
};

export type GroomerStackParamList = {
  GroomerHome: undefined;
  GroomerReservationDetail: { reservationId: string };
  GroomerProfile: undefined;
};

export type RootStackParamList = AuthStackParamList & CustomerStackParamList & GroomerStackParamList;

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.user?.role);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!token ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : role === 'groomer' ? (
          <>
            <Stack.Screen name="GroomerHome" component={GroomerHomeScreen} />
            <Stack.Screen name="GroomerReservationDetail" component={GroomerReservationDetailScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="CustomerHome" component={CustomerHomeScreen} />
            <Stack.Screen name="GroomerList" component={GroomerListScreen} />
            <Stack.Screen name="GroomerDetail" component={GroomerDetailScreen} />
            <Stack.Screen name="ReservationConfirm" component={ReservationConfirmScreen} />
            <Stack.Screen name="GroomerProfile" component={GroomerProfileScreen} /> 
            <Stack.Screen name="PetManage" component={PetManageScreen} />
            <Stack.Screen name="PetForm" component={PetFormScreen} />
            <Stack.Screen name="ReviewForm" component={ReviewFormScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
