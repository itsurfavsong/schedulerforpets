import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppNavigator from './src/navigation/AppNavigator';
import { useAuthStore } from './src/store/authStore';
import { usePushNotifications } from './src/hooks/useNotifications';

const queryClient = new QueryClient();

function RootApp() {
  const { loadAuth, isLoading } = useAuthStore();
  usePushNotifications();

  useEffect(() => {
    void loadAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return <AppNavigator />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootApp />
    </QueryClientProvider>
  );
}