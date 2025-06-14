import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house" color={color} />,
        }}
      />
      <Tabs.Screen
        name="onboarding"
        options={{
          title: 'Onboarding',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          title: 'Login',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="etudes"
        options={{
          title: 'Etudes',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="book" color={color} />,
        }}
      />
      <Tabs.Screen
        name="evenements"
        options={{
          title: 'Evènements',

          tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar" color={color} />,

        }}
      />
      <Tabs.Screen
        name="evenements_admin"
        options={{
          title: "Admin",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="shield" color={color} />,
        }}
      />
      <Tabs.Screen
        name="articles"
        options={{
          title: 'Articles',

          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.line.text.clipboard" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profilIntervenant"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person" color={color} />,

        }}
      />
      <Tabs.Screen
        name="profiladmin"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person" color={color} />,

        }}
      />

    </Tabs>


    
  );
}
